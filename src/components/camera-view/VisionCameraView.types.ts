export interface HoopDetection {
  box: {
    x: number; // top-left
    y: number; // top-left
    width: number;
    height: number;
  };
}

export interface BallDetection {
  box: {
    cx: number; // center
    cy: number; // center
    radius: number;
  };
  opacity: number;
}
