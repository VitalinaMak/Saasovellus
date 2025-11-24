"use strict"

let valittuKaupunki = 0;

document.querySelector("#hae").addEventListener("click", naytaSaa);

window.addEventListener("load", () => {
  defaultWeather("#ekaKaupunki", "Raahe", 1);
  defaultWeather("#tokaKaupunki", "Girona", 2);
  defaultWeather("#kolmasKaupunki", "Bryssel", 3);
  defaultWeather("#neljasKaupunki", "Zlin", 4);
});

//haetaan sää uudelle kaupungille
async function haeSaa(kaupunki) {
  const apiKey = "f203ca8925d570ec434d263a1bb3be3a"; // lisää oma avain
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${kaupunki}&appid=${apiKey}&units=metric&lang=fi`;
  try {
    const vastaus = await fetch(url);
    if (!vastaus.ok) throw new Error("Kaupunkia ei löytynyt");

    const data = await vastaus.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Virhe haussa:", error);
    return null;
  }
}

//funktio toista kaupunkia etsimiselle
async function naytaSaa() {
  const kaupunki = document.querySelector("#etsiKaupunki").value;
  const tulos = document.querySelector("#tulos");

  
  const data = await haeSaa(kaupunki);
  if (!data) {
    tulos.textContent = "Säätietoja ei voitu hakea.";
    return;
  }

 /*  <img src="https://openweathermap.org/img/wn/${ikoni}@2x.png"> */

  let kaupunkiVaihtoon;
  if (valittuKaupunki == 0) {
    kaupunkiVaihtoon = document.getElementById("kaupunki4");  //jos ei mitään kaupunki valittu, valitaan viimeinen kaupunki
  } else {
    kaupunkiVaihtoon = valittuKaupunki;
  }

  let uusiKaupunginNimi = document.createElement("h2");   //luodaan uusi h2-elementti kaupungin nimelle
  uusiKaupunginNimi.setAttribute("class", "kaupunginNimi");

  let uudetTiedot = document.createElement("div");    //luodaan uusi div-elementti
  let tunnus = kaupunkiVaihtoon.lastElementChild.id;  //haetaan id..
  uudetTiedot.setAttribute("id", tunnus);             // ..ja annetaan sen uudelle elementille

  uusiKaupunginNimi.innerText = data.name;   //kirjoitetaan kaupungin nimen h2-elementtiin

  let uusiKuvaus = data.weather[0].description;
  let uusiLampo = data.main.temp;
  let uusiIkoni = data.weather[0].icon;
  let uusiTuuli = data.wind.speed;
  let uusiWindDir = data.wind.deg; 

  let uusiTuulenKuva = vaihdaTuulenKuva(uusiWindDir);
  
  uudetTiedot.innerHTML = `
      <p class="lampo">${uusiLampo} °C</p>
      <p class="tuuli">Tuulen nopeus: ${uusiTuuli} m/s <img class="tuulenKuva" src=${uusiTuulenKuva}></p>
  `;

  kaupunkiVaihtoon.replaceChildren(uusiKaupunginNimi, uudetTiedot);  //lisätään uudet tiedot sivulle vanhojen tietojrn sijaan
  vaihdatausta(kaupunkiVaihtoon, uusiKuvaus);
}

//näytetään sää Raahessa, Gironassa, Brysselissä ja Zlinissa
async function defaultWeather(kaupunginValitsin, kaupunki, numero) {
  let tulos = document.querySelector(kaupunginValitsin);
  let data = await haeSaa(kaupunki);
  if (!data) {
    tulos.textContent = "Säätietoja ei voitu hakea.";
    return;
  }
  let kuvaus = data.weather[0].description;
  let lampo = data.main.temp;
  let ikoni = data.weather[0].icon;
  let tuuli = data.wind.speed;
  let windDir = data.wind.deg;
  console.log(kaupunki + ": " + windDir);

  let mainObject = document.getElementById(`kaupunki${numero}`);

  vaihdatausta(mainObject, kuvaus);

  let tuulenKuva = vaihdaTuulenKuva(windDir);
  
    //kuvat: <img src="https://openweathermap.org/img/wn/${ikoni}@2x.png">
    //<p class="kuvaus">${kuvaus}</p>

  tulos.innerHTML = `
      <p class="lampo">${lampo} °C</p>
      <p class="tuuli">Tuulen nopeus: ${tuuli} m/s <img class="tuulenKuva" src=${tuulenKuva}></p>
  `;
  mainObject.appendChild(tulos);
}

//näytetään lisää tietoja ilmasta valitussa kaupungissa
async function lisaTietoa(id) {
  let moreInfo = document.getElementById("moreInfo");
  let otsikko = document.createElement("h3");
  let tiedot = document.createElement("p");
  let kaupunginId = "kaupunki" + id;
  let elementti = document.getElementById(kaupunginId);  //haetaan elementti kaupungin id:llä
  let kaupunginNimi = elementti.querySelector("h2").innerHTML;  //haetaan kaupungin nimi
  let kaikkiKaupungit = document.getElementsByClassName("kaupungit");

  valittuKaupunki = elementti;
  
  if(moreInfo.firstChild) {
    moreInfo.removeChild(moreInfo.lastChild);
    moreInfo.removeChild(moreInfo.lastChild);
  }
  
  let city = "";
  let poistaMuotoilu;

  
  for (let i=1; i<5; i++) {
      city = "kaupunki" + i;
      poistaMuotoilu = document.getElementById(city)
      if (poistaMuotoilu.classList.contains('aktiivinen')) {
        poistaMuotoilu.classList.remove('aktiivinen');
      }
    } 
    elementti.classList.add('aktiivinen');

  let data = await haeSaa(kaupunginNimi);  //haetaan säätiedot kaupungille
  if (!data) {
    tulos.textContent = "Säätietoja ei voitu hakea.";
    return;
  }
  let kuvaus = data.weather[0].description;
  let lampo = data.main.temp;
  let tuuli = data.wind.speed;
  let windDir = data.wind.deg;
  
  let tuulenKuvaus = "";
  if ((windDir < 22.25) || (windDir >= 337.25)) {
    tuulenKuvaus = "Pohjoistuuli "
  } else if ((windDir >= 22.25) && (windDir < 67.25)) {
    tuulenKuvaus = "Koillistuuli "
  } else if ((windDir >= 67.25) && (windDir < 112.25)) {
    tuulenKuvaus = "Itätuuli "
  } else if ((windDir >= 112.25) && (windDir < 157.25)) {
    tuulenKuvaus = "Kaakkoistuuli "
  } else if ((windDir >= 157.25) && (windDir < 202.25)) {
    tuulenKuvaus = "Etelätuuli "
  } else if ((windDir >= 202.25) && (windDir < 247.25)) {
    tuulenKuvaus = "Llounaistuuli "
  } else if ((windDir >= 247.25) && (windDir < 292.25)) {
    tuulenKuvaus = "Länsituuli "
  } else if ((windDir >= 292.25) && (windDir < 337.25)) {
    tuulenKuvaus = "Luoteistuuli "
  }

  otsikko.innerText = kaupunginNimi;  //lisätään tiedot html-elementtiin
  tiedot.innerText = lampo + " °C" + "\n" + kuvaus + "\n" + tuulenKuvaus + tuuli + "m/s";

  moreInfo.appendChild(otsikko);  //lisätään html-elementti sivulle
  moreInfo.appendChild(tiedot);
}

function vaihdatausta(elementti, kuvaus) {
  if (kuvaus=="taivas on selkeä") {
    elementti.style.backgroundImage="url(selkeaTaivas.png)"
  } else if (kuvaus=="pilvinen") {
    elementti.style.backgroundImage="url(pilvinen.png)"
  } else if (kuvaus=="vähän pilviä") {
    elementti.style.backgroundImage="url(puolipilvinen.jpg)"
  } else if (kuvaus=="hajanaisia pilviä") {
    elementti.style.backgroundImage="url(hajanaisiaPilvia.jpg)"
  } else if (kuvaus=="ajoittaisia pilviä") {
    elementti.style.backgroundImage="url(ajoittaisiaPilvia.jpg)"
  } else if (kuvaus=="sumu") {
    elementti.style.backgroundImage="url(sumu.jpg)"
  } else if (kuvaus.includes("tihkusade") || kuvaus=="pieni sade") {
    elementti.style.backgroundImage="url(pieniSade.jpg)"
  } else if (kuvaus=="sade" || kuvaus=="kohtalainen sade") {
    elementti.style.backgroundImage="url(sade.png)"
  } else if (kuvaus=="kova sade") {
    elementti.style.backgroundImage="url(kovaSade.jpg)"
  } else if (kuvaus.includes("lumi")) {
    elementti.style.backgroundImage="url(lumi2.jpg)"
  } else {
    elementti.style.backgroundImage="url(default.jpg)";
  }
}

function vaihdaTuulenKuva(windDir) {
  if ((windDir < 22.25) || (windDir >= 337.25)) {
    return("osoitin0.png");
  } else if ((windDir >= 22.25) && (windDir < 67.25)) {
    return("osoitin45.png");
  } else if ((windDir >= 67.25) && (windDir < 112.25)) {
    return("osoitin90.png");
  } else if ((windDir >= 112.25) && (windDir < 157.25)) {
    return("osoitin135.png");
  } else if ((windDir >= 157.25) && (windDir < 202.25)) {
    return("osoitin180.png");
  } else if ((windDir >= 202.25) && (windDir < 247.25)) {
    return("osoitin225.png");
  } else if ((windDir >= 247.25) && (windDir < 292.25)) {
    return("osoitin270.png");
  } else if ((windDir >= 292.25) && (windDir < 337.25)) {
    return("osoitin315.png");
  }
}