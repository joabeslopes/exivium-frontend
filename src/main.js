const token = 'meu_token';
const host = window.location.host === '' ? 'localhost' : window.location.host;
const port = window.location.host === '' ? '8000' : '80';

async function getCameras(){
  url = `http://${host}:${port}/api/allCameras?token=${token}`
  allCameras = await fetch(url)
                    .then(response => response.json())
                    .catch(error => alert('Erro ao buscar cameras'))
  return allCameras;
};

async function startCamera(channel) {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

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

async function getPlugins(){
  url = `http://${host}:${port}/api/allPlugins?token=${token}`
  allPlugins = await fetch(url)
                    .then(response => response.json())
                    .catch(error => alert('Erro ao buscar plugins'))
  return allPlugins;
};

async function startPlugin(plugin) {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

  const ws = new WebSocket(`${protocol}${host}:${port}/ws/results/${plugin.name}/${plugin.channel}?token=${token}`);
  const canvas = document.getElementById("plugin"+plugin.channel);
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

  allPlugins = await getPlugins()
  allPlugins.forEach( startPlugin );
};

init()