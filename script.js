let historyList = [];

async function checkNews() {

    const newsInput = document.getElementById("newsInput").value.trim();
    const resultBox = document.getElementById("result");

    if (newsInput === "") {

        resultBox.innerHTML = `
            <h2>Please Enter News</h2>
            <p>Enter a news headline or article to check.</p>
        `;

        return;
    }

    resultBox.innerHTML = `
        <h2>Analyzing...</h2>
        <p>Please wait while the ML model checks the news.</p>
    `;

    try {

        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                news: newsInput
            })
        });

        const data = await response.json();

        let result;

        if (data.result === "FAKE") {
            result = "Potentially Fake News";
        } else if (data.result === "REAL") {
            result = "Likely Real News";
        } else {
            result = data.result;
        }

        resultBox.innerHTML = `
            <h2>${result}</h2>

            <p>
                <strong>Confidence:</strong>
                ${data.confidence}%
            </p>

            <p>
                The result was generated using the trained machine learning model.
            </p>

            <p>
                <strong>News Status:</strong>
                Analysis Completed
            </p>
        `;

        historyList.push({
            news: newsInput,
            result: result,
            confidence: data.confidence
        });

        displayHistory();

    } catch (error) {

        resultBox.innerHTML = `
            <h2>Connection Error</h2>
            <p>Please make sure the Python backend is running.</p>
        `;

        console.error(error);
    }
}

function displayHistory() {

    const historyBox = document.getElementById("history");

    if (!historyBox) {
        return;
    }

    historyBox.innerHTML = `
        <h2>News Checking History</h2>
    `;

    historyList.forEach(function(item) {

        historyBox.innerHTML += `
            <div class="history-item">

                <p>
                    <strong>News:</strong>
                    ${item.news}
                </p>

                <p>
                    <strong>Result:</strong>
                    ${item.result}
                </p>

                <p>
                    <strong>Confidence:</strong>
                    ${item.confidence}%
                </p>

            </div>
        `;

    });
}

function clearNews() {

    document.getElementById("newsInput").value = "";

    document.getElementById("result").innerHTML = `
        <h2>Result</h2>
        <p>Your result will appear here.</p>
    `;
}

function clearHistory() {

    historyList = [];

    displayHistory();
}