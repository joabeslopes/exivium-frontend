const token = "meu_token";
const ws = new WebSocket(`ws://localhost:8000/ws/video?token=${token}`);
const canvas = document.getElementById("video");
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