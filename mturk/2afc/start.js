let callbackPrepared = false;

function prepareCallback() {
  if (callbackPrepared) {
    return;
  }
  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event) {
    let origin_url = new URL(event.origin);

    if (origin_url.origin !== window.location.origin) return;

    let data = JSON.parse(event.data);

    jsPsych.turk.submitToTurk(data, "POST");
  }
}

function openExperiment() {
  prepareCallback();

  let windowObjectReference = window.open(
    "./task.html" + window.location.search
  );
  windowObjectReference.focus();
}

function showPreview() {
  let container = document.createElement("div");
  container.className = "jspsych-display-element";
  container.style.cssText =
    "position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%); display: block;text-align: center;";

  let p = document.createElement("p");
  p.style.marginBottom = "75px";
  p.appendChild(
    document.createTextNode(
      "This HIT is an academic experiment on image classification."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(document.createElement("br"));
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "In this experiment, two groups of images will be presented to you."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Your task is to choose one out of two additional images which resembles a group of images better."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode("Below you can see what the experiment looks like.")
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Please note that you can only participate once in this HIT."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Your anonymized responses will be used in a scientific study."
    )
  );

  let img = document.createElement("img");
  img.src = "./data/instruction_screenshots/0.jpg";
  img.style.cssText = "width: auto; max-width: 600px;";

  container.appendChild(p);
  container.appendChild(img);

  document.body.appendChild(container);
}

function showAlreadyParticipatedWarning() {
  let container = document.createElement("div");
  container.className = "jspsych-display-element";
  container.style.cssText =
    "position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%); display: block;text-align: center;";

  let p = document.createElement("p");
  p.style.marginBottom = "75px";
  p.appendChild(
    document.createTextNode("Thanks for your interest in this HIT.")
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Since you have already participated in a similar experiment, " +
        "you cannot participate again."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(document.createTextNode("Please return the HIT."));
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "We hope to see you again in the future for a different experiment!"
    )
  );

  container.appendChild(p);
  document.body.appendChild(container);
}

function showLoadWarning() {
  let container = document.createElement("div");
  container.className = "jspsych-display-element";
  container.style.cssText =
    "position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%); display: block;text-align: center;";

  let p = document.createElement("p");
  p.style.marginBottom = "75px";
  p.appendChild(
    document.createTextNode("There was an error loading this HIT.")
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Please try to load this page again or return the HIT. Thank you."
    )
  );

  container.appendChild(p);
  document.body.appendChild(container);
}

function showStart() {
  let container = document.createElement("div");
  container.className = "jspsych-display-element";
  container.style.cssText =
    "position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%); display: block;text-align: center;";

  let p = document.createElement("p");
  p.style.marginBottom = "75px";
  p.appendChild(
    document.createTextNode(
      "This HIT is an academic experiment on image classification."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Your anonymized responses will be used in a scientific study."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(document.createTextNode("For questions please contact "));
  let link = document.createElement("a");
  link.setAttribute("href", "mailto:judy.borowski@uni-tuebingen.de");
  link.appendChild(document.createTextNode("judy.borowski@uni-tuebingen.de"));
  p.appendChild(link);
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "In this experiment, two groups of images will be presented to you."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "Your task is to choose one out of two additional images which resembles a group of images better."
    )
  );
  p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "To increase the quality of the experiment we will later ask you to switch to fullscreen mode and to keep it until the end of the experiment."
    )
  );
  +p.appendChild(document.createElement("br"));
  p.appendChild(
    document.createTextNode(
      "If you're ready, click the button at the bottom. A new page will be opened for you - make sure this pop-up is not blocked by your browser."
    )
  );
  p.appendChild(document.createElement("br"));

  let btn = document.createElement("button");
  btn.addEventListener("click", openExperiment);
  btn.className = "jspsych-btn";
  btn.textContent = "Go to the experiment";
  let btn_container = document.createElement("div");
  btn_container.appendChild(btn);

  container.appendChild(p);
  container.appendChild(btn_container);

  document.body.appendChild(container);
}

function showOutsideWarning() {
  let warning = document.createElement("p");
  warning.appendChild(
    document.createTextNode("You can only access this site from within MTurk.")
  );
  document.body.appendChild(warning);
}

function initialize() {
  // check whether the HIT has been accepted
  let url = new URL(window.location.href);
  const debug = url.searchParams.get("debug");

  const debug_mode = debug !== null;
  let turk_info = jsPsych.turk.turkInfo();
  if (turk_info.outsideTurk && !debug_mode) {
    document.body.innerHTML = "";
    showOutsideWarning();
  } else if (turk_info.previewMode) {
    document.body.innerHTML = "";
    showPreview();
  } else {
    let bouncer_url = new URL(
      "/mturk/bouncer/requestaccess",
      `${location.protocol}//${location.host}`
    );
    const eid = url.searchParams.get("exp");
    const tns = url.searchParams.get("tns");
    bouncer_url.searchParams.append("wid", turk_info.workerId);
    bouncer_url.searchParams.append("eid", eid);
    bouncer_url.searchParams.append("tns", tns);

    fetchJson(bouncer_url.toString())
      .then((resp) => {
        if (!resp["access"]) {
          showAlreadyParticipatedWarning();
        } else {
          document.body.innerHTML = "";
          showStart();
        }
      })
      .catch((resp) => showLoadWarning());
  }
}
