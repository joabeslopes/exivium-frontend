const token = "meu_token";
const ws = new WebSocket(`ws://localhost:8000/ws/video?token=${token}`);
const img = document.getElementById("video");

ws.binaryType = "blob";
ws.onmessage = (event) => {
  const url = URL.createObjectURL(event.data);
  img.src = url;
};

ws.onerror = (event) => {
    console.error(event);
};
  
ws.onclose = () => {
console.log('Conexão fechada');
};