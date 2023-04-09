export class GameEngine {
  constructor() {
    this.points = 0;
    this.time = 0;
    this.leftHandRaised = 0;
    this.rightHandRaised = 0;
    this.balloons = [];
    this.currentBalloon = null;
    this.balloonRadius = 8;
    this.balloonVelocity = 10; // pixels per second
    this.canvas = document.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d');
    this.statsElement = document.getElementById('statistics');
    this.leftHandInStartingPosition = false;
    this.rightHandInStartingPosition = false;
  }

  poseCalculator(pose) {
    // Get the keypoints of the pose
    const keypoints = pose.keypoints;

    // Get the x and y coordinates of the left and right shoulders
    const leftShoulder = keypoints.find((kp) => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find((kp) => kp.name === 'right_shoulder');
    const leftWrist = keypoints.find((kp) => kp.name === 'left_wrist');
    const rightWrist = keypoints.find((kp) => kp.name === 'right_wrist');

    // Check if all keypoints are present
    if (leftShoulder && rightShoulder && leftWrist && rightWrist) {
      // Calculate the angle between the shoulders and the left and right wrists
      const angleLeft = Math.abs(Math.atan2(leftWrist.y - leftShoulder.y, leftWrist.x - leftShoulder.x) - Math.atan2(leftShoulder.y - rightShoulder.y, leftShoulder.x - rightShoulder.x)) * (180 / Math.PI);
      const angleRight = Math.abs(Math.atan2(rightWrist.y - rightShoulder.y, rightWrist.x - rightShoulder.x) - Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x)) * (180 / Math.PI);

      this.leftHandInStartingPosition = angleLeft > 70;
      this.rightHandInStartingPosition = angleRight > 70;
      console.log(angleRight);

      // Check if the left or right hand has moved at least 70 degrees compared to the body
      if (this.currentBalloon !== null && !this.currentBalloon.selected) {
        const leftHandAction = angleLeft < 10;
        const rightHandAction = angleRight < 10;

        if (leftHandAction) {
          this.leftHandRaised++;
          this.currentBalloon.selected = true;

          if (this.currentBalloon && this.currentBalloon.number % 2 === 1) {
            this.points++;
          } else {
            this.points--;
          }
        }

        if (rightHandAction) {
          this.rightHandRaised++;
          this.currentBalloon.selected = true;

          if (this.currentBalloon && this.currentBalloon.number % 2 === 0) {
            this.points++;
          } else {
            this.points--;
          }
        }
      }
    }
  }

  generateBalloon() {
    if (this.leftHandInStartingPosition && this.rightHandInStartingPosition) {
      const canvasWidth = this.canvas.width;
      const balloonNumber = Math.floor(Math.random() * 100);
      const balloonX = Math.floor(Math.random() * (canvasWidth - 2 * this.balloonRadius)) + this.balloonRadius;
      const balloonY = -(2*this.balloonRadius);
      const balloon = {x: balloonX, y: balloonY, radius: this.balloonRadius, number: balloonNumber, selected: false, velocity: this.balloonVelocity};
      this.balloons.push(balloon);
      this.currentBalloon = balloon;
    }
  }

  drawBalloon(context, balloon) {
    context.beginPath();
    context.arc(balloon.x, balloon.y, balloon.radius, 0, 2 * Math.PI);
    context.fillStyle = '#f44336';
    context.fill();
    context.font = '12px Arial';
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.fillText(balloon.number, balloon.x, balloon.y+4);
  }

  drawStatistics() {
    // Display the statistics
    const minutes = Math.floor(this.time / 60);
    const seconds = Math.floor(this.time % 60);
    const timePlayed = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    this.statsElement.innerHTML = `Points: ${this.points} | Left Hand Raised: ${this.leftHandRaised} | Right Hand Raised: ${this.rightHandRaised} | Time Played: ${timePlayed}`;
  }

  destroyCurrentBalloon() {
    const index = this.balloons.indexOf(this.currentBalloon);
    if (index !== -1) {
      this.balloons.splice(index, 1);
    }
    this.currentBalloon = null;
  }

  update(elapsedTime) {
    this.drawStatistics();

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    this.time += elapsedTime;

    if (!this.currentBalloon) {
      this.generateBalloon();
    } else {
      if (this.currentBalloon.selected) {
        this.destroyCurrentBalloon();
      } else {
        if (this.currentBalloon.y >= (canvasHeight + this.balloonRadius)) {
          this.destroyCurrentBalloon();
          this.points--;
        } else {
          this.balloons.forEach((balloon) => {
            balloon.y += balloon.velocity * elapsedTime;
          });
        }
      }
    }

    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.balloons.forEach((balloon) => {
      this.drawBalloon(this.context, balloon);
    });
  }

  startGame() {
    const gameRuntimeMS = 300000;

    const intervalId = setInterval(() => {
      this.update(0.02);

      // Check if the game is over
      if (this.time >= gameRuntimeMS) {
        clearInterval(intervalId);
        alert(`Game Over! You scored ${this.points} points!`);
      }
    }, 20);
  }
}
