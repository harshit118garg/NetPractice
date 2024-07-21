document.addEventListener("DOMContentLoaded", function () {
  /* getting all the necessary elements from the DOM */
  const ballOptionsContainer = document.getElementById(
    "ballOptions"
  ) as HTMLDivElement;
  const newBallBtn = document.getElementById("newBall") as HTMLButtonElement;
  const endGameBtn = document.getElementById("endGame") as HTMLButtonElement;
  const startMatchBtn = document.getElementById(
    "startMatch"
  ) as HTMLButtonElement;
  const info = document.getElementById("info") as HTMLDivElement;
  const teamDetails = document.getElementById("teamDetails") as HTMLDivElement;
  const overDetails = document.getElementById("overDetails") as HTMLDivElement;
  const oversSelect = document.querySelector(
    "#numOfOvers select"
  ) as HTMLSelectElement;

  /* ------------------------------------------------------- */

  /* hiding and diabling the unecessary elements and buttons at start */
  newBallBtn.disabled = true;
  endGameBtn.disabled = true;
  info.classList.add("hidden");
  teamDetails.classList.add("hidden");
  overDetails.classList.add("hidden");

  /* ------------------------------------------------------- */

  /* necessary constants */
  const overOptions = [
    { name: "Select number of overs", value: "0" },
    { name: "Super Over", value: "1" },
    { name: "2", value: "2" },
    { name: "5", value: "5" },
  ];
  const ballsOptions = ["W", "0", "1", "2", "3", "4", "6"];

  /* ------------------------------------------------------- */

  /* populate necessary ball options html */
  ballsOptions.forEach((ballOption) => {
    let ballBtn = document.createElement("button") as HTMLButtonElement;
    ballBtn.disabled = true;
    ballBtn.className += `border rounded-md text-center border-cyan-700 bg-white p-1 w-8 flex items-center justify-center`;
    ballBtn.innerText = ballOption;

    ballOptionsContainer.appendChild(ballBtn);
  });

  /* ------------------------------------------------------- */

  /* populate overs dropdown */
  overOptions.forEach((overOption) => {
    let overOpt = document.createElement("option") as HTMLOptionElement;
    overOpt.value = overOption.value;
    overOpt.innerText = overOption.name;

    oversSelect.appendChild(overOpt);
  });

  /* ------------------------------------------------------- */

  /* creating necessary state variables */
  let numOfOvers: number = 0;
  let numberOfBalls: number = 0;
  let numberOfBallsThrown: number = 0;
  let numberOfOversThrown: number = 0;
  let team1Score: number = 0;
  let team2Score: number = 0;
  let team1WicketsDown: number = 0;
  let team2WicketsDown: number = 0;
  let currentPlayer: number = 0;

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

  /* ------------------------------------------------------- */

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
      info.classList.remove("hidden");
      info.innerHTML = `<h2>Game has Started</h2>`;
    }
  }

  endGameBtn.addEventListener("click", endGame);

  function endGame() {
    numOfOvers = 0;
    numberOfBalls = 0;
    numberOfBallsThrown = 0;
    numberOfOversThrown = 0;
    team1Score = 0;
    team2Score = 0;
    team1WicketsDown = 0;
    team2WicketsDown = 0;
    currentPlayer = 0;
    startMatchBtn.disabled = false;
    newBallBtn.disabled = true;
    endGameBtn.disabled = true;
    overDetails.classList.add("hidden");
    info.classList.add("hidden");
    oversSelect.value = "0"
    oversSelect.disabled = false;
  }

  newBallBtn.addEventListener("click", newBallActions);

  function newBallActions() {
    if (currentPlayer === 3) {
      alert("match has ended");
      decideWinner();
      return;
    }

    if (currentPlayer === 2) {
      const player2WinAlready = checkIfPlayerWon();
      if (player2WinAlready) {
        alert("match has ended");
        decideWinner();
        return;
      }
    }

    if (numberOfBallsThrown <= 5) {
      numberOfBallsThrown++;
      throwNewBall();
    } else if (numberOfBallsThrown === 6) {
      numberOfOversThrown++;
      if (numberOfOversThrown === numOfOvers) {
        console.log(`${currentPlayer} innnings has finished`);
        populateDashBoard(currentPlayer);
        currentPlayer++;
        numberOfBallsThrown = 0;
        numberOfOversThrown = 0;
      } else {
        console.log(`new over started`);
        populateDashBoard(currentPlayer);
        numberOfBallsThrown = 0;
        numberOfBallsThrown++;
        throwNewBall();
      }
    } else {
      currentPlayer++;
      numberOfBallsThrown = 0;
    }
    info.innerHTML = `<h2>Player ${currentPlayer} innings</h2>`;
  }

  const populatePerBall = (perBallScore: string) => {
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
    // numberOfBallsThrown++;
  }

  function checkIfPlayerWon() {
    if (team2Score > team1Score) {
      return true;
    }
    return false;
  }

  function decideWinner() {
    if (team1Score !== team2Score) {
      info.innerHTML = `<h2>Player ${
        team1Score > team2Score ? 1 : 2
      } has won</h2>`;
    } else {
      info.innerHTML = `<h2>Match has ended in a draw</h2>`;
    }
    newBallBtn.disabled = true;
    endGameBtn.disabled = true;
    startMatchBtn.disabled = false;
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
