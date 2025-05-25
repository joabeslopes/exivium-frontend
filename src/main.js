const token = 'meu_token';

async function getCameras(){
  url = `/api/allCameras?token=${token}`
  allCameras = await fetch(url)
                    .then(response => response.json())
                    .catch(error => alert('Erro ao buscar cameras'))
  return allCameras
};

async function startCamera(channel) {

  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const host = window.location.host === '' ? 'localhost' : window.location.host;
  const port = window.location.host === '' ? '8000' : '80';

  const ws = new WebSocket(`${protocol}${host}:${port}/ws/video/${channel}?token=${token}`);
  const canvas = document.getElementById("video"+channel);
  const ctx = canvas.getContext("2d");

  ws.binaryType = "blob";
  ws.onmessage = async (event) => {
    try {
      const bitmap = await createImageBitmap(event.data);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error("Erro ao desenhar imagem:", error);
    }
  };

  ws.onerror = (event) => {
    console.error(event);
  };

  ws.onclose = () => {
    console.log('Conexão fechada');
  };
};

async function init() {
  allCameras = await getCameras()
  allCameras.forEach( startCamera );
};

init()