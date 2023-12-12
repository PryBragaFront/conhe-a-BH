const apiUrl = 'https://albumapi.pricillalopes.repl.co';

function init() {
  exibefotos();
  exibeDestaques();
  inicializarMapa();
}

function exibefotos() {
  featuredImages = document.getElementById('featured-images');
  featuredImages.innerHTML = '';

  const rowsection = document.createElement('div');
  rowsection.className = 'row g-4';
  var albuns = [];

  getAlbuns(dados => {
    albuns = dados;

    albuns.forEach((uni) => {
      createAlbunsElement(uni, rowsection);
    });

    featuredImages.appendChild(rowsection);
  });
}

function exibeDestaques() {
  carrosel = document.getElementById('carroselIndex');

  var destaques = [];

  getDestaques(dados => {
    destaques = dados;

    destaques.forEach((uni) => {
      createDestaqueElement(uni, carrosel);
    });

    if (carrosel.children.length > 0) {
      carrosel.children[0].className = 'carousel-item active';
    }
  });
}

function montaModal(albumId) {
  const carrosel = document.getElementById('carroselModal');
  carrosel.innerHTML = '';
  var fotosModal = [];

  getFotos(albumId, dados => {
    fotosModal = dados;

    fotosModal.forEach((foto) => {
      createSlideModal(foto, carrosel, foto.description);
    });

    if (carrosel.children.length > 0) {
      carrosel.children[0].className = 'carousel-item active';
    }
  });
}

function createAlbunsElement(album, rowsection) {
  const albumContainer = document.createElement('div');
  albumContainer.id = 'album';
  albumContainer.className = 'col-12 col-md-4';

  const img = document.createElement('img');
  img.className = 'img-fluid';
  img.src = album.cover || 'placeholder.jpg';

  const navLink = document.createElement('a');
  navLink.className = 'nav-link';
  navLink.href = 'DetalhesAlbum.html?id=' + album.id;

  const bannerContent = document.createElement('div');
  bannerContent.className = 'banner-content';
  bannerContent.innerHTML = `<p class="secondary-color"></p>
                            <h3>${album.name}</h3>`;

  const infoContainer = document.createElement('div');
  infoContainer.innerHTML = `<p>${album.name}</p>`;

  albumContainer.appendChild(img);
  navLink.appendChild(bannerContent);
  albumContainer.appendChild(navLink);
  albumContainer.appendChild(infoContainer);

  rowsection.appendChild(albumContainer);
}

function createDestaqueElement(uni, carrosel) {
  const carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';
  carouselItem.innerHTML = `
  <img src="${uni.coverAlbum}" class="d-block w-100" />
  <div class="carousel-caption">
  </div>`;
  carrosel.appendChild(carouselItem);
}

function createSlideModal(uni, carrosel, texto) {
  const titulo = document.createElement('p');
  titulo.innerHTML = texto;

  const carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';
  carouselItem.innerHTML = `
  <img src="${uni.image}" class="d-block w-100" />
  <div class="carousel-caption">
  </div>`;

  carouselItem.appendChild(titulo);
  carrosel.appendChild(carouselItem);
}

function exibeDetalhesAlbum() {
  let albumId = getParameterByName('id');
  detalhesAlbum = document.getElementById('detalhes-album');
  detalhesAlbum.innerHTML = '';

  var albuns = [];
  const rowContent = document.createElement('div');
  rowContent.className = 'row';

  getAlbuns(dados => {
    albuns = dados;

    for (i = 0; i < albuns.length; i++) {
      if (albumId == albuns[i].id) {
        createDetalhesAlbum(albuns[i], rowContent);
      }
    }

    detalhesAlbum.appendChild(rowContent);
  });

  photosImages = document.getElementById('photos-images');
  photosImages.innerHTML = '';

  var photos = [];

  getFotos(albumId, dados => {
    photos = dados;

    for (i = 0; i < photos.length; i++) {
      if (albumId == photos[i].albumId) {
        createPhotosDetalhes(photos[i], photosImages);
      }
    }
  });

  getDestaqueByAlbumId(albumId, dados => {
    var destaqueCheckbox = document.getElementById('destaqueCheckbox');

    if (dados.length > 0) {
      destaqueCheckbox.checked = true;
    } else {
      destaqueCheckbox.checked = false;
    }
  });
}

function createDetalhesAlbum(album, rowContent) {
  rowContent.className = 'row';
  rowContent.innerHTML = `<div class="col-3">
                                <img src="${album.cover}" alt="Projeto 1" class="img-fluid" />
                              </div>
                              <div class="col-9">
                                <div class="row">
                                  <div class="col-12">
                                        <h5 class="danger-color">Descrição</h5>
                                        <p class="subtitle secondary-color">
                                        ${album.description}
                                        </p>
                                  </div>
                                  <div class="col-7">
                                    <h5 class="danger-color">localização</h5>
                                    <p class="subtitle secondary-color">
                                    ${album.location_name}
                                    </p>
                                  </div>
                                  <div class="col-3">
                                    <h5 class="danger-color">Data de Registro</h5>
                                    <p class="subtitle secondary-color">
                                    ${album.date}
                                    </p>
                                  </div>

                                  <div class="form-check col-2">
                                      <input
                                      class="form-check-input"
                                      type="checkbox"
                                      value=""
                                      id="destaqueCheckbox"
                                      onclick="alterarDestaque()"
                                    />
                                    <label class="form-check-label" for="destaqueCheckbox">Destaque</label>
                                </div>
                                </div>
                              </div>`;
}

function createPhotosDetalhes(photo, photosImages) {
  const colContent = document.createElement('div');
  colContent.className = 'col-12 col-md-3';

  const divImg = document.createElement('div');

  const imagemClicavel = document.createElement('img');
  imagemClicavel.className = 'img-fluid';
  imagemClicavel.id = 'imagemClicavel';
  imagemClicavel.src = photo.image || 'placeholder.jpg';

  imagemClicavel.addEventListener('click', () => {
    montaModal(photo.albumId);
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  });

  const descriptionContent = document.createElement('div');
  descriptionContent.innerHTML = `<p>${photo.description}</p>`;

  divImg.appendChild(imagemClicavel);
  colContent.appendChild(divImg);
  colContent.appendChild(descriptionContent);
  photosImages.appendChild(colContent);
}

function inicializarMapa() {
  const centralLatLong = [-43.9397233, -19.9332786];
  mapboxgl.accessToken = 'pk.eyJ1IjoicHJpY2lsbGFicmFnYSIsImEiOiJjbHBsdzNhZWcwMzY1MnFtc2J5Y291NGZtIn0.jzreIMe1Jf9iLRVBqhaMpw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: centralLatLong,
    zoom: 9
  });

  var marcadores = [];

  getAlbuns(dados => {
    marcadores = dados;
    marcadores.forEach((uni) => {
      let popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h6><a href="DetalhesAlbum.html?id=${uni.id}">${uni.name}</a></h6><br>
                      ${uni.location_name}`);
      const marker = new mapboxgl.Marker({ color: uni.location_cor })
        .setLngLat(uni.location_coordinates)
        .setPopup(popup)
        .addTo(map);
    });

    navigator.geolocation.getCurrentPosition(processarGeo, () => { alert('Erro ao obter localização.'); });
  });
}

function processarGeo(local) {
  let popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3> Estou aqui!!! </h3>`);
  const marker = new mapboxgl.Marker({ color: 'yellow' })
    .setLngLat([local.coords.longitude, local.coords.latitude])
    .setPopup(popup)
    .addTo(map);
}

function alterarDestaque() {
  let destaqueCheckbox = document.getElementById('destaqueCheckbox').checked;
  let albumId = getParameterByName('id');

  if (destaqueCheckbox) {
    getAlbumById(albumId, dados => {
      if (dados) {
        const destaque = {
          albumId: albumId,
          coverAlbum: dados.cover
        };
        inserirDestaque(destaque);
      }
    });
  } else {
    getDestaqueByAlbumId(albumId, dados => {
      if (dados.length > 0) {
        dados.forEach(dado => {
          excluirDestaque(dado.id, dados);
        });
      }
    });
  }
}

function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// MÉTODOS DE COMUNICAÇÃO COM API/JSON SERVER
function getAlbuns(processaDados) {
  fetch(apiUrl + '/albuns')
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao ler albuns via API JSONServer:', error);
    });
}

function getAlbumById(albumId, processaDados) {
  fetch(`${apiUrl}/albuns/${albumId}`)
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao ler destaques via API JSONServer:', error);
    });
}

function getFotos(albumId, processaDados) {
  fetch(apiUrl + '/fotos?albumId=' + albumId)
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao ler fotos via API JSONServer:', error);
    });
}

function getDestaques(processaDados) {
  fetch(apiUrl + '/destaques')
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao ler destaques via API JSONServer:', error);
    });
}

function getDestaqueByAlbumId(albumId, processaDados) {
  fetch(`${apiUrl}/destaques?albumId=${albumId}`)
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao ler destaques via API JSONServer:', error);
    });
}

function inserirDestaque(destaque, processaDados) {
  fetch(apiUrl + '/destaques', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(destaque),
  })
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao ler destaques via API JSONServer:', error);
    });
}

function excluirDestaque(destaqueId, processaDados) {
  fetch(`${apiUrl}/destaques/${destaqueId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      processaDados(data);
    })
    .catch(error => {
      console.error('Erro ao excluir destaque via API JSONServer:', error);
    });
}
