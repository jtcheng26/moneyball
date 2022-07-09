//
//  OpenCVWrapper.m
//  eagleapp2
//
//  Created by Jeffrey Cheng on 6/26/22.
//

#import "OpenCVWrapper.h"
#import <opencv2/opencv.hpp>
#import <opencv2/imgcodecs/ios.h>
#include <opencv2/imgproc/imgproc.hpp>

#define MADE_SHOT 1
#define MISS_SHOT -1
#define IN_MOTION 2
#define NO_MOTION 0

#define LEFT 0
#define TOP 1
#define RIGHT 2
#define BOTTOM 3

#define CX 0
#define CY 1
#define CR 2

typedef cv::Point3_<uint8_t> Pixel;

@implementation OpenCVWrapper

static cv::Mat *bgFrame;
static int bgLoc[4] = {0, 0, 416, 416}; // top-left x, top-left y, width, height
static int hoopLoc[4] = {0, 0, 416, 416}; // left, top, right, bottom

static cv::Vec3f ball = cv::Vec3f(0, 0, 1);
static int lastDetection = -1; // # of frames since ball last detected
static int MISS_THRESHOLD = 30; // # of frames to wait before declaring miss
static int UPDATE_BG_THRESHOLD = 50; // # of additional frames to wait before updating bg mat (to account for changes in lighting, noise, etc.)
static int shotState = NO_MOTION; // global shot state, either IN_MOTION, NO_MOTION, or MADE_SHOT

// sanity check
+ (NSString *)openCVVersionString {
  
  return [NSString stringWithFormat:@"OpenCV Version %s",  CV_VERSION];
}

// process & update state
+ (NSArray *)processFrame:(UIImage *)frame {
  cv::Mat *currFrame = [self prepareFrame: frame];
  
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame for MISS_THRESHOLD frames
  // background is updated after MISS_THRESHOLD + UPDATE_BG_THRESHOLD frames of no ball detection and a frame similar enough to the previous background (movementThresh)
  int state = NO_MOTION;
  double movementAmt = cv::sum(*currFrame)[0];
  double movementThresh = (255 / 4 * (currFrame->cols) * (currFrame->rows));
//  std::cout << movementAmt << " should be less than " << movementThresh << "\n";
  
  // do nothing if too much movement
  if (movementAmt < movementThresh) {
    std::vector<cv::Vec3f> circles = [self extractCircles: currFrame];
    if (!circles.empty()) {
      cv::Vec3f nowBall = circles[0];
      double best = 0;
      int bigCircles = 0; // if too many circles are filled, assume interference and don't do anything, avoiding false positives
      for (cv::Vec3f circ : circles) {
        int left = std::max(0, int(circ[0]-circ[2]));
        int top = std::max(0, int(circ[1]-circ[2]));
        int width = std::max(0, std::min(currFrame->cols - left, int(2 * circ[2])));
        int height = std::max(0, std::min(currFrame->rows - top, int(2 * circ[2])));
        cv::Mat ballMat = (*currFrame)(cv::Rect(left, top, width, height));
        double cnt = cv::sum(ballMat)[0] / (255 * circ[2] * circ[2] * 4); // overflow possible (?)
        if (cnt > best) {
          nowBall = circ;
          best = cnt;
        }
        if (cnt > 0.7) {
          bigCircles += 1;
        }
      }
      if (bigCircles < 4 && best >= 0.5) {
        ball = nowBall;
        lastDetection = 0;
        
        if (shotState == IN_MOTION) {
          // a little bit of padding
          if (ball[CX] - ball[CR] >= hoopLoc[LEFT] - ball[CR] / 3 && ball[CX] + ball[CR] <= hoopLoc[RIGHT] + ball[CR] / 3 && (ball[CY] - ball[CR]) >= hoopLoc[TOP] + (hoopLoc[BOTTOM] - hoopLoc[TOP]) / 4) {
            shotState = state = MADE_SHOT;
          }
        } else if (shotState == NO_MOTION) {
          shotState = IN_MOTION;
        }
      } else if (lastDetection >= 0) {
        lastDetection += 1;
      }
    } else if (lastDetection >= 0) {
      lastDetection += 1;
    }
    if (lastDetection > 0) {
      if (lastDetection >= MISS_THRESHOLD && shotState == IN_MOTION) {
        state = MISS_SHOT;
        shotState = NO_MOTION;
        // add padding after shot so its only counted once as it goes throught the net
      } else if (lastDetection >= MISS_THRESHOLD && shotState == MADE_SHOT) {
        shotState = NO_MOTION;
      }
      
      if (lastDetection > MISS_THRESHOLD + UPDATE_BG_THRESHOLD) {
        [self updateBackground:frame leftArg:bgLoc[0]+hoopLoc[0] topArg:bgLoc[1]+hoopLoc[1] rightArg:bgLoc[0]+hoopLoc[2] bottomArg:bgLoc[1]+hoopLoc[3]];
        lastDetection = -1;
      }
    }
    delete currFrame;
  } else {
    delete currFrame;
    return @[@0];
  }
  
  // convert to coordinates relative to entire frame
  return shotState == NO_MOTION ? @[@(state)] : @[@(state), @(bgLoc[0] + ball[CX]), @(bgLoc[1] + ball[CY]), @(ball[CR])];
}

// update hoop location
+ (NSArray *)updateBackground:(UIImage *)frame leftArg:(int)left topArg:(int)top rightArg:(int)right bottomArg:(int)bottom {
  if (bgFrame == nil) {
    bgFrame = new cv::Mat;
  }
  
  UIImageToMat(frame, *bgFrame, true);

  bgLoc[0] = std::max(0, left - (right - left));
  bgLoc[1] = std::max(0, top - (bottom - top));
  bgLoc[2] = std::max(0, std::min(bgFrame->cols - bgLoc[0], 3 * (right - left)));
  bgLoc[3] = std::max(0, std::min(bgFrame->rows - bgLoc[1], int(2.5 * (bottom - top))));
  
  // relative to bgLoc
  hoopLoc[0] = left - bgLoc[0];
  hoopLoc[1] = top - bgLoc[1];
  hoopLoc[2] = right - bgLoc[0];
  hoopLoc[3] = bottom - bgLoc[1];
  
  (*bgFrame)(cv::Rect(bgLoc[0], bgLoc[1], bgLoc[2], bgLoc[3])).copyTo(*bgFrame);
  
  bgFrame = [self greyFilter: bgFrame];
  bgFrame = [self gaussFilter: bgFrame];
  
  // convert back to coordinates relative to entire frame
  return @[@(bgLoc[0] + hoopLoc[0]), @(bgLoc[1] + hoopLoc[1]), @(bgLoc[0] + hoopLoc[2]), @(bgLoc[1] + hoopLoc[3])];
}
// analyze frame
+ (std::vector<cv::Vec3f>)extractCircles:(cv::Mat *)image {
  std::vector<cv::Vec3f> circles;
  cv::Mat cannyfied;
  cv::Canny(*image, cannyfied, 5, 70, 3);
  int minSize = (hoopLoc[2] - hoopLoc[0]) / 5; // too small might be bird
  int maxSize = (hoopLoc[2] - hoopLoc[0]) / 2 / 1.5; // too big impossible to go in

  HoughCircles(*image, circles, cv::HOUGH_GRADIENT, 2, (hoopLoc[2] - hoopLoc[0]) / 2,32, 36, minSize, maxSize);
  
  return circles;
}
// just take first hc, adjust 200 param, adjust 0.8 param, try w/o binary

// processing methods
+ (cv::Mat *)prepareFrame:(UIImage *)frame {
  cv::Mat *currFrame = new cv::Mat;
  UIImageToMat(frame, *currFrame, true);
  // rotations
  if (frame.imageOrientation == UIImageOrientationRight) {
    cv::rotate(*currFrame, *currFrame, cv::ROTATE_90_CLOCKWISE);
  } else if (frame.imageOrientation == UIImageOrientationLeft) {
    cv::rotate(*currFrame, *currFrame, cv::ROTATE_90_COUNTERCLOCKWISE);
  } else if (frame.imageOrientation == UIImageOrientationDown) {
    cv::rotate(*currFrame, *currFrame, cv::ROTATE_180);
  };
  (*currFrame)(cv::Rect(bgLoc[0], bgLoc[1], bgLoc[2], bgLoc[3])).copyTo(*currFrame);
  
  currFrame = [self greyFilter: currFrame];
  currFrame = [self gaussFilter: currFrame];
  currFrame = [self imgDiff: bgFrame img2: currFrame];
  currFrame = [self binaryFilter: currFrame];
  
  return currFrame;
}

+ (cv::Mat *)imgDiff:(cv::Mat *)img img2:(cv::Mat *)img2 {
  cv::Mat *diffed = new cv::Mat;
  cv::absdiff(*img, *img2, *diffed);
  delete img2;

  return diffed;
}

+ (cv::Mat *)greyFilter:(cv::Mat *)img {
  cv::Mat *greyed = new cv::Mat;
  cv::cvtColor(*img, *greyed, cv::COLOR_RGBA2GRAY);
  delete img;

  return greyed;
}

+ (cv::Mat *)gaussFilter:(cv::Mat *)img {
  cv::Mat *gaussed = new cv::Mat;
  cv::GaussianBlur(*img, *gaussed, cv::Size(23, 23), 0, 0);
  delete img;
  
  return gaussed;
}

+ (cv::Mat *)binaryFilter:(cv::Mat *)img {
  cv::Mat *binarized = new cv::Mat;
  cv::threshold(*img, *binarized, 26, 255, cv::THRESH_BINARY);
  delete img;
  
  return binarized;
}

// visual testing
+ (UIImage *)testFunc:(UIImage *)frame {
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame
//  cv::Mat *currFrame = [self prepareFrame: frame];
  cv::Mat *currFrame = new cv::Mat;
  UIImageToMat(frame, *currFrame, true);
  (*currFrame)(cv::Rect(bgLoc[0], bgLoc[1], bgLoc[2], bgLoc[3])).copyTo(*currFrame);
//  currFrame = [self greyFilter: currFrame];
//  currFrame = [self gaussFilter: currFrame];
  
//  std::vector<cv::Vec3f> circles = [self extractCircles: currFrame];
  
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame
  int state = NO_MOTION;
  
//  cv::Mat retFrame;
//  cv::cvtColor(*currFrame, retFrame, cv::COLOR_GRAY2RGB);
  
//  if (!circles.empty()) {
//    cv::Vec3f nowBall = circles[0];
//    for (cv::Vec3f circ : circles) {
////      cv::circle(retFrame, cv::Point(circ[0], circ[1]), circ[2], cv::Scalar(255, 136, 0), 4);
//      // A basketball should be roughly 1/2 the size of the rim (9.5 inches vs 18 inches)
//      int predictedRadius = (hoopLoc[2] - hoopLoc[0]) / 4;
//      if (abs(circ[2] - predictedRadius) < abs(nowBall[2] - predictedRadius)) {
//        nowBall = circ;
//      }
//    }
//    ball = nowBall;
//    lastDetection = 0;
//
//    if (shotState == IN_MOTION) {
//      if (ball[CX] - ball[CR] >= hoopLoc[LEFT] && ball[CX] + ball[CR] <= hoopLoc[RIGHT] && ball[CY] >= hoopLoc[TOP]) {
//        shotState = state = MADE_SHOT;
//      }
//    } else if (shotState == NO_MOTION) {
//      shotState = IN_MOTION;
//    }
//  } else if (lastDetection >= 0) {
//    lastDetection += 1;
//    if (lastDetection >= MISS_THRESHOLD and shotState == IN_MOTION) {
//      state = MISS_SHOT;
//      shotState = NO_MOTION;
//    } else if (lastDetection >= MISS_THRESHOLD and shotState == MADE_SHOT) {
//      shotState = NO_MOTION;
//    }
//  }
  
//  cv::circle(*currFrame, cv::Point(ball[0], ball[1]), ball[2], cv::Scalar(255, 136, 0, 255), 4);
  
  UIImage *conv = MatToUIImage(*currFrame);
  return conv;
}

+ (UIImage *)testFunc2 {
  cv::Mat retFrame;
  cv::cvtColor(*bgFrame, retFrame, cv::COLOR_GRAY2RGB);
  cv::circle(retFrame, cv::Point(ball[0], ball[1]), ball[2], cv::Scalar(255, 136, 0), 4);
  cv::rectangle(retFrame, cv::Point(hoopLoc[0], hoopLoc[1]), cv::Point(hoopLoc[2], hoopLoc[3]), cv::Scalar(0, 136, 255), 4);
  
  UIImage *conv = MatToUIImage(retFrame);
  return conv;
}

+ (UIImage *)testFunc3:(UIImage*)frame {
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame
//  cv::Mat *currFrame = [self prepareFrame: frame];
  cv::Mat *currFrame = [self prepareFrame: frame];
  std::vector<cv::Vec3f> circles = [self extractCircles: currFrame];
//  cv::Mat cannyfied;
//  cv::Canny(*currFrame, cannyfied, 5, 70, 3);
  
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame
  int state = NO_MOTION;
  cv::Mat retFrame;
  cv::cvtColor(*currFrame, retFrame, cv::COLOR_GRAY2RGB);
  
  if (!circles.empty()) {
    cv::Vec3f nowBall = circles[0];
    double best = 0;
    for (cv::Vec3f circ : circles) {
      cv::circle(retFrame, cv::Point(circ[0], circ[1]), circ[2], cv::Scalar(255, 136, 0), 4);
      // A basketball should be roughly 1/2 the size of the rim (9.5 inches vs 18 inches)
      int left = std::max(0, int(circ[0]-circ[2]));
      int top = std::max(0, int(circ[1]-circ[2]));
      int width = std::min(currFrame->cols - left, int(2 * circ[2]));
      int height = std::min(currFrame->rows - top, int(2 * circ[2]));
      cv::Mat ballMat = (*currFrame)(cv::Rect(left, top, width, height));
      double cnt = cv::sum(ballMat)[0];
      if (cnt > best) {
        nowBall = circ;
        best = cnt;
      }
    }
  }
  
  cv::circle(retFrame, cv::Point(ball[0], ball[1]), ball[2], cv::Scalar(136, 244, 0), 4);
  cv::rectangle(retFrame, cv::Point(hoopLoc[0], hoopLoc[1]), cv::Point(hoopLoc[2], hoopLoc[3]), cv::Scalar(0, 136, 255), 4);
  
  delete currFrame;
  
  UIImage *conv = MatToUIImage(retFrame);
  return conv;
}

+ (UIImage *)testFunc4:(UIImage *)frame {
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame
//  cv::Mat *currFrame = [self prepareFrame: frame];
  cv::Mat *currFrame = [self prepareFrame: frame];
  std::vector<cv::Vec3f> circles = [self extractCircles: currFrame];
  cv::Mat cannyfied;
  cv::Canny(*currFrame, cannyfied, 5, 70, 3);
  
  // frame shot state, either MADE_SHOT, MISS_SHOT, or NO_MOTION
  // NO_MOTION indicates the shot is neither a make nor miss
  // a make or miss is returned once per shot attempt and resets once the ball leaves the frame
  int state = NO_MOTION;
  cv::Mat retFrame;
  cv::cvtColor(cannyfied, retFrame, cv::COLOR_GRAY2RGB);
  
  if (!circles.empty()) {
    cv::Vec3f nowBall = circles[0];
    double best = 0;
    for (cv::Vec3f circ : circles) {
      cv::circle(retFrame, cv::Point(circ[0], circ[1]), circ[2], cv::Scalar(255, 136, 0), 4);
      // A basketball should be roughly 1/2 the size of the rim (9.5 inches vs 18 inches)
      int left = std::max(0, int(circ[0]-circ[2]));
      int top = std::max(0, int(circ[1]-circ[2]));
      int width = std::min(currFrame->cols - left, int(2 * circ[2]));
      int height = std::min(currFrame->rows - top, int(2 * circ[2]));
      cv::Mat ballMat = (*currFrame)(cv::Rect(left, top, width, height));
      double cnt = cv::sum(ballMat)[0];
      if (cnt > best) {
        nowBall = circ;
        best = cnt;
      }
    }
  }
  
  cv::circle(retFrame, cv::Point(ball[0], ball[1]), ball[2], cv::Scalar(136, 244, 0), 4);
  cv::rectangle(retFrame, cv::Point(hoopLoc[0], hoopLoc[1]), cv::Point(hoopLoc[2], hoopLoc[3]), cv::Scalar(0, 136, 255), 4);
  
  delete currFrame;
  
  UIImage *conv = MatToUIImage(retFrame);
  return conv;
}


@end
