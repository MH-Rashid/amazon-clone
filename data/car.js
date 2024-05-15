class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  }

  displayInfo() {
    console.log(
      `${this.#brand} ${this.#model}, Speed: ${this.speed} km/h, Trunk is ${
        this.isTrunkOpen ? "open" : "closed"
      }`
    );
  }

  go() {
    if (this.isTrunkOpen) {
      return;
    }

    this.speed += 5;

    if (this.speed > 200) {
      this.speed = 200;
      return;
    }
  }

  brake() {
    this.speed -= 5;

    if (this.speed < 0) {
      this.speed = 0;
    }
  }

  openTrunk() {
    if (this.speed > 0) {
      return;
    }

    this.isTrunkOpen = true;
  }

  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  go() {
    this.speed += this.acceleration;

    if (this.speed > 300) {
      this.speed = 300;
      return;
    }
  }

  openTrunk() {
    console.log('Race cars do not have a trunk');
  }

  closeTrunk() {
    console.log('Race cars do not have a trunk');
  }
}

const toyota = new Car({
  brand: "Toyota",
  model: "Corolla",
});

const tesla = new Car({
  brand: "Tesla",
  model: "Model 3",
});

const raceCar = new RaceCar({
  brand: "McLaren",
  model: "F1",
  acceleration: 20,
});

// raceCar.go();
// raceCar.go();
// raceCar.brake();
raceCar.openTrunk();
raceCar.openTrunk();
raceCar.go();

raceCar.displayInfo();