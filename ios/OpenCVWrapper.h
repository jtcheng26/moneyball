//
//  OpenCVWrapper.h
//  eagleapp2
//
//  Created by Jeffrey Cheng on 6/26/22.
//

#import <Foundation/Foundation.h>
#import "OpenCVWrapper.h"
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface OpenCVWrapper : NSObject

// sanity check
+ (NSString *)openCVVersionString;


+ (NSArray *)processFrame:(UIImage *)frame;

// update hoop location
+ (NSArray *)updateBackground:(UIImage *)frame leftArg:(int)left topArg:(int)top rightArg:(int)right bottomArg:(int)bottom;

// visually test processing
+ (UIImage *)testFunc:(UIImage *)frame;

+ (UIImage *)testFunc2;

+ (UIImage *)testFunc3:(UIImage*)frame;

+ (UIImage *)testFunc4:(UIImage *)frame;

@end

NS_ASSUME_NONNULL_END
