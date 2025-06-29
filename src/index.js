document.addEventListener("DOMContentLoaded", () => {
  const DOGS_URL = "http://localhost:3000/pups";
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterBtn = document.getElementById("good-dog-filter");

  let filterOn = false;
  let allDogs = [];

  function fetchDogs() {
    fetch(DOGS_URL)
      .then(res => res.json())
      .then(dogs => {
        allDogs = dogs;
        renderDogBar();
      });
  }

  function renderDogBar() {
    dogBar.innerHTML = "";
    const dogsToShow = filterOn
      ? allDogs.filter(dog => dog.isGoodDog)
      : allDogs;

    dogsToShow.forEach(dog => {
      const span = document.createElement("span");
      span.textContent = dog.name;
      span.addEventListener("click", () => showDogInfo(dog));
      dogBar.appendChild(span);
    });
  }

  function showDogInfo(dog) {
    dogInfo.innerHTML = `
      <img src="${dog.image}" alt="${dog.name}" />
      <h2>${dog.name}</h2>
    `;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
    toggleBtn.addEventListener("click", () => toggleDogStatus(dog, toggleBtn));

    dogInfo.appendChild(toggleBtn);
  }

  function toggleDogStatus(dog, button) {
    const newStatus = !dog.isGoodDog;

    fetch(`${DOGS_URL}/${dog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ isGoodDog: newStatus })
    })
      .then(res => res.json())
      .then(updatedDog => {
        dog.isGoodDog = updatedDog.isGoodDog;
        button.textContent = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!";
        renderDogBar(); 
      });
  }

  filterBtn.addEventListener("click", () => {
    filterOn = !filterOn;
    filterBtn.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
    renderDogBar();
  });


  fetchDogs();
});
