
const firebaseConfig = {
  apiKey: "AIzaSyBFABtE8u3Bcnza2Aono9yFl6aN2f6F2zQ",
  authDomain: "babymath-data.firebaseapp.com",
  projectId: "babymath-data",
  storageBucket: "babymath-data.appspot.com",
  messagingSenderId: "535678073642",
  appId: "1:535678073642:web:964cda18a45c7b04a97c53",
  measurementId: "G-7CN48FECP3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const gameKeys = [
  "111-100", "111-200", "222-100", "222-200",
  "333-100", "333-200", "444-100", "444-200",
  "555-100", "555-200", "666-100", "666-200",
  "777-100", "777-200"
];

let currentEmail = "";

function showPopup(msg) {
  document.getElementById("popup").innerText = msg;
  document.querySelector(".overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.querySelector(".overlay").style.display = "none";
  document.getElementById("popup").style.display = "none";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  db.collection("babymath").doc(email).get().then(doc => {
    if (!doc.exists) return showPopup("User not found");
    const data = doc.data();
    if (data.password !== password) return showPopup("Wrong password");

    currentEmail = email;
    localStorage.setItem("babymathUser", email); // Save for future auto login
    document.getElementById("buttons").style.display = "flex";
    document.getElementById("login-section").style.display = "none";
    showPopup("Login successful");
    loadLeaderboard();
  }).catch(error => {
    console.error("Login error:", error);
    showPopup("Login failed");
  });
}

function logout() {
  currentEmail = "";
  localStorage.removeItem("babymathUser");
  document.getElementById("buttons").style.display = "none";
  document.getElementById("login-section").style.display = "flex";
  showPopup("Logged out successfully");
}

function calculateGPoint(games) {
  return (
    (parseInt(games["777-100"] || 0)) +
    2 * ((parseInt(games["777-200"] || 0)) + (parseInt(games["555-100"] || 0))) +
    3 * ((parseInt(games["555-200"] || 0)) + (parseInt(games["666-100"] || 0))) +
    4 * ((parseInt(games["666-200"] || 0)) + (parseInt(games["444-100"] || 0)) + (parseInt(games["111-100"] || 0))) +
    5 * ((parseInt(games["111-200"] || 0)) + (parseInt(games["222-100"] || 0))) +
    6 * ((parseInt(games["222-200"] || 0)) + (parseInt(games["333-100"] || 0))) +
    7 * (parseInt(games["333-200"] || 0)) +
    8 * (parseInt(games["444-200"] || 0))
  );
}

function uploadToDatabase() {
  if (!currentEmail) return;

  const games = {};
  gameKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      games[key] = parseInt(value);
    }
  });

  const gPoint = calculateGPoint(games);
  localStorage.setItem("g-point", gPoint);

  const timestamp = firebase.firestore.Timestamp.now();

  db.collection("babymath").doc(currentEmail).update({
    games,
    "g-point": gPoint,
    "last-updated": timestamp
  }).then(() => {
    showPopup("Uploaded to database");
    loadLeaderboard();
  }).catch(err => {
    console.error("Upload error:", err);
    showPopup("Failed to upload");
  });
}

function downloadFromDatabase() {
  if (!currentEmail) return;

  db.collection("babymath").doc(currentEmail).get().then(doc => {
    if (doc.exists) {
      const games = doc.data().games || {};
      for (let key in games) {
        localStorage.setItem(key, games[key]);
        console.log(`Set ${key}: ${games[key]}`);
      }
      showPopup("Downloaded to localStorage");
    }
  }).catch(err => {
    console.error("Download error:", err);
    showPopup("Failed to fetch games");
  });
}

function loadLeaderboard() {
  db.collection("babymath").get().then(snapshot => {
    const rows = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const time = data["last-updated"]?.toDate().toLocaleTimeString() || "-";
      const date = data["last-updated"]?.toDate().toLocaleDateString() || "-";
      rows.push({ email: doc.id, gPoint: data["g-point"] || 0, date, time });
    });

    rows.sort((a, b) => b.gPoint - a.gPoint);

    const tbody = document.querySelector("#leaderboard tbody");
    tbody.innerHTML = "";
    rows.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${row.email}</td><td>${row.gPoint}</td><td>${row.date}</td><td>${row.time}</td>`;
      tbody.appendChild(tr);
    });
  });
  showPopup("Leaderboard Refreshed");
}

// Auto-login if saved
window.onload = () => {
  const savedEmail = localStorage.getItem("babymathUser");
  if (savedEmail) {
    db.collection("babymath").doc(savedEmail).get().then(doc => {
      if (doc.exists) {
        currentEmail = savedEmail;
        document.getElementById("buttons").style.display = "flex";
        document.getElementById("login-section").style.display = "none";
        showPopup("Welcome back!");
        loadLeaderboard();
      } else {
        localStorage.removeItem("babymathUser");
        loadLeaderboard();
      }
    });
  } else {
    loadLeaderboard();
  }
};

let confirmCallback = null;

function showConfirm(dol) {
let message = '';

if (dol === 'download') {
message = 'After clicking Yes, your score will be reset. Click Yes only if you have reinstalled the app, cleared your data, or are playing for the first time on a different device.';
confirmCallback = downloadFromDatabase;
} else if (dol === 'upload') {
message = 'Do you want to upload your local data to the database? This will overwrite any existing data.';
confirmCallback = uploadToDatabase;
} else {
message = 'Are you sure?';
confirmCallback = null;
}

document.getElementById('confirmMessage').innerText = message;
document.getElementById('confirmBox').style.display = 'flex';
}

function hideConfirm() {
document.getElementById('confirmBox').style.display = 'none';
confirmCallback = null;
}

function confirmYes() {
if (typeof confirmCallback === 'function') {
confirmCallback();
}
hideConfirm();
}
