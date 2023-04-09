# A game using Pre-trained TensorFlow.js pose-detection model

### Game requirements:

From the top border of the canvas, auto-generated balloons should fall with random numbers in them.
In a given moment only one balloon should fall.
The next balloon is generated when the previous one has been selected from the player OR it has reached the bottom border of the canvas.
The selection is made this way:
-If the number inside the balloon is odd, the player should raise the left hand (Theis action is already detected in the JavaScript class provided). The player then gets plus 1 point for successful selection. But if the balloon reaches the bottom of the canvas OR the player raises the right hand, he will be deducted 1 point.

-If the number inside the balloon is even, the player should raise the right hand (Theis action is already detected in the JavaScript class provided). The player then gets plus 1 point for successful selection. But if the balloon reaches the bottom of the canvas OR the player raises the left hand, he will be deducted 1 point.

The total number of points should be shown at the bottom of the canvas in a "Statistics" overlay alongside the total number of left hand raised and right hand raised and the time played.

The game is over after 5 minutes of playing.
