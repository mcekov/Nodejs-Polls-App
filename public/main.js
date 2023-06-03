const form = document.getElementById("vote-form");

// Submit Form Events
form.addEventListener("submit", (e) => {
  const choice = document.querySelector("input[name=os]:checked").value;
  const data = { os: choice };

  fetch("http://localhost:3000/poll", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  e.preventDefault();
});

fetch("http://localhost:3000/poll")
  .then((res) => res.json())
  .then((data) => {
    const votes = data.votes;
    const totalVotes = votes.length;

    // Count votes
    const voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
      ),
      {}
    );

    // Set initial points
    if (
      Object.keys(voteCounts).length === 0 &&
      voteCounts.constructor === Object
    ) {
      voteCounts.Windows = 0;
      voteCounts.MacOS = 0;
      voteCounts.Linux = 0;
      voteCounts.Other = 0;
    }

    let datapoints = [
      { label: "Windows", y: voteCounts.Windows },
      { label: "MacOS", y: voteCounts.MacOS },
      { label: "Linux", y: voteCounts.Linux },
      { label: "Other", y: voteCounts.Other },
    ];

    const charContainer = document.querySelector("#chartContainer");

    if (charContainer) {
      const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "theme1",
        title: { text: `Total Votes ${totalVotes}` },
        data: [
          {
            type: "column",
            dataPoints: datapoints,
          },
        ],
      });

      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = false;

      const pusher = new Pusher("24f9a55f5dea39ccb061", {
        cluster: "eu",
        useTLS: true,
      });

      const channel = pusher.subscribe("os-pool");

      channel.bind("os-vote", function (data) {
        datapoints = datapoints.map((x) => {
          if (x.label === data.os) {
            x.y += data.points;
            return x;
          } else {
            return x;
          }
        });
        chart.render();
      });
    }
  });
