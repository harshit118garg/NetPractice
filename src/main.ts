document.addEventListener("DOMContentLoaded", function () {
  /* getting all the necessary elements from the DOM */
  const newBallBtn = document.getElementById("newBall") as HTMLButtonElement;
  const endGameBtn = document.getElementById("endGame") as HTMLButtonElement;
  const startMatchBtn = document.getElementById(
    "startMatch"
  ) as HTMLButtonElement;
  const winner = document.getElementById("winner") as HTMLDivElement;
  const teamDetails = document.getElementById("teamDetails") as HTMLDivElement;
  const overDetails = document.getElementById("overDetails") as HTMLDivElement;
  const oversSelect = document.querySelector(
    "#numOfOvers select"
  ) as HTMLSelectElement;
  /* ------------------------------------------------------- */

  /* hiding and diabling the unecessary elements and buttons at start */

  newBallBtn.disabled = true;
  endGameBtn.disabled = true;
  winner.classList.add("hidden");
  teamDetails.classList.add("hidden");
  overDetails.classList.add("hidden");

  /* ------------------------------------------------------- */

  /* necessary constants */
  const ballsOptions = ["W", "0", "1", "2", "3", "4", "6"];

  /* ------------------------------------------------------- */

  /* creating necessary state variables */
  let numOfOvers: number = 0;
  let numberOfOversThrown: number = 0;
  let numberOfBalls: number = 0;
  let numberOfBallsThrown: number = 0;
  let team1Score: number = 0;
  let team2Score: number = 0;
  let team1WicketsDown: number = 0;
  let team2WicketsDown: number = 0;
  let team1ScorePerOver = new Array<string>(numOfOvers);
  let team2ScorePerOver = new Array<string>(numOfOvers);
  let currentPlayer: number = 0;
  let count = 0;

  /* ------------------------------------------------------- */

  /* creating necessary elements */
  // overDetails
  const perBallContainer = document.createElement("div");
  perBallContainer.id = "perBall";
  perBallContainer.className += `flex gap-4 justify-center items-center`;
  const overDetailsHead = document.createElement("h3");
  overDetails.appendChild(perBallContainer);
  overDetails.appendChild(overDetailsHead);

  // team Details
  const team1Details = document.createElement("div");
  team1Details.id = "team1";
  const team1Head = document.createElement("h4");
  team1Head.innerText = "Team 1";
  team1Details.appendChild(team1Head);
  const team2Details = document.createElement("div");
  team2Details.id = "team2";
  const team2Head = document.createElement("h4");
  team2Head.innerText = "Team 2";
  team2Details.appendChild(team2Head);
  teamDetails.appendChild(team1Details);
  teamDetails.appendChild(team2Details);
  /* ------------------------------------------------------- */

  /* getting the over value */
  oversSelect.addEventListener("change", function (event) {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      numOfOvers = +target.value;
      numberOfBalls = numOfOvers * 6;
      console.log("numOfOvers", numOfOvers);
      console.log("numberOfBalls", numberOfBalls);
      oversSelect.disabled = true;
    }
  });

  startMatchBtn.addEventListener("click", startGame);

  function startGame() {
    if (numOfOvers === 0) {
      alert("select number of overs first");
    } else {
      console.log("game start");
      currentPlayer++;
      console.log("team 1 inings start");
      startMatchBtn.disabled = true;
      newBallBtn.disabled = false;
      endGameBtn.disabled = false;

      overDetails.appendChild(overDetailsHead);
      overDetails.classList.remove("hidden");
    }
  }

  newBallBtn.addEventListener("click", () => {
    if (currentPlayer !== 2) {
      // team 1 inings
      if (numberOfBallsThrown < 6) {
        console.log(`throw ${count} over`);
        throwNewBall();
      } else if (numberOfBallsThrown === 6 && count !== numOfOvers - 1) {
        console.log("an over of an innings has finished");
        console.log(`throw ${count} over`);
        count++;
        throwNewBall();
        populateDashBoard(currentPlayer);
        numberOfBallsThrown = 0;
      } else {
        console.log("currentPlayer " + currentPlayer + " innings has finished");
        populateDashBoard(currentPlayer);
        currentPlayer++;
      }
      numberOfBallsThrown++;
    } else {
      console.warn("team 2 innings start");
    }
  });

  const populatePerBall = (perBallScore: string) => {
    // console.log("perBallScore", perBallScore);
    const scoreSpan = document.createElement("span");
    scoreSpan.className += `border border-black rounded-xl inline-block h-8 w-8 text-center bg-green-200 p-1`;
    scoreSpan.innerText = perBallScore;
    perBallContainer.appendChild(scoreSpan);
  };

  function throwNewBall() {
    const perBallScore = newBall();
    const isTeam1 = currentPlayer === 1;

    const score = isTeam1 ? team1Score : team2Score;
    const wickets = isTeam1 ? team1WicketsDown : team2WicketsDown;

    const updatedScore = perBallScore !== "W" ? score + +perBallScore : score;
    const updatedWickets = perBallScore === "W" ? wickets + 1 : wickets;

    if (isTeam1) {
      team1Score = updatedScore;
      team1WicketsDown = updatedWickets;
    } else {
      team2Score = updatedScore;
      team2WicketsDown = updatedWickets;
    }

    overDetailsHead.innerText = `Score - ${updatedScore}/${updatedWickets}`;
    populatePerBall(perBallScore);
  }

  const populateDashBoard = (currentPlayer: number) => {
    perBallContainer.innerHTML = "";

    const { score, wickets, teamDetailsDiv } =
      currentPlayer === 1
        ? {
            score: team1Score,
            wickets: team1WicketsDown,
            teamDetailsDiv: team1Details,
          }
        : {
            score: team2Score,
            wickets: team2WicketsDown,
            teamDetailsDiv: team2Details,
          };

    const perOver = document.createElement("p");
    perOver.innerText = `Over = ${score}/${wickets}`;
    teamDetailsDiv.appendChild(perOver);

    teamDetails.classList.remove("hidden");
  };

  const newBall = () =>
    ballsOptions[Math.floor(Math.random() * ballsOptions.length)];
});
