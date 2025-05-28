let coins = 0;
let seconds = 0;

const hatsData = {
    chapeu1: { name: "Tiara de Rena", price: 50, purchased: false, characterImage: "images/p_1.gif" },
    chapeu2: { name: "Bucket Rosa", price: 60, purchased: false, characterImage: "images/p_2.gif" },
    chapeu3: { name: "Bucket de Pescador", price: 70, purchased: false, characterImage: "images/p_3.gif" },
    chapeu4: { name: "Bucket Azul", price: 70, purchased: false, characterImage: "images/p_4.gif" },
    chapeu5: { name: "Gorro de Carneiro", price: 100, purchased: false, characterImage: "images/p_5.gif" },
    chapeu6: { name: "Gorro de Ganso", price: 150, purchased: false, characterImage: "images/p_6.gif" },
    chapeu7: { name: "Gorro de Tigre", price: 200, purchased: false, characterImage: "images/p_7.gif" },
    chapeu8: { name: "Chapéu 8", price: 100, purchased: false, characterImage: "images/p_8.gif" },
};

let currentHatToBuyId = null;
let currentCarouselIndex = 0;
const hatsPerPage = 3;
let hatItemWidth = 0;
let currentlyEquippedHatId = null; // Variável para rastrear o chapéu equipado

const audioCompra = document.getElementById('audio-compra-efetivada');
const audioTrocaChapeu = document.getElementById('audio-troca-chapeu');
const audioCliqueCarrossel = document.getElementById('audio-clique-carrossel');
const audioMoedaInsuficiente = document.getElementById('audio-moeda-insuficiente');
const audioSairMenu = document.getElementById('audio-sair-menu');
const audioSelecionaChapeu = document.getElementById('audio-seleciona-chapeu');

// Duração do seu GIF de brilho em milissegundos (ajuste conforme necessário)
const SPARKLE_DURATION_MS = 700; // Exemplo: 0.7 segundos

function startTimer() {
    setInterval(() => {
        seconds++;
        coins += 10;
        updateDisplay();
    }, 1000);
}

function updateDisplay() {
    const clockElement = document.getElementById("clock");
    const coinsValueElement = document.getElementById("coins-value"); // Seleciona o span
    // Se você tiver o display de moedas no menu de confirmação:
    const confirmationCoinsValueElement = document.getElementById("confirmation-coins-value");

    if (clockElement) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        clockElement.innerText = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    if (coinsValueElement) {
        coinsValueElement.innerText = coins; // Atualiza apenas o número
    }
    if (confirmationCoinsValueElement) {
        confirmationCoinsValueElement.innerText = coins; // Atualiza apenas o número no menu
    }
}

function showConfirmationMenu(hatId) {
    audioSelecionaChapeu.play(); // Toca o áudio de seleção de chapéu
    currentHatToBuyId = hatId;
    const hat = hatsData[hatId];
    const confirmationMenu = document.getElementById("confirmation-menu");
    const confirmationMessage = document.getElementById("confirmation-message");
    const insufficientFundsMessage = document.getElementById("insufficient-funds");
    const buyButton = document.getElementById("buy-button");

    confirmationMessage.innerText = `Deseja comprar ${hat.name} com ${hat.price} moedas?`;
    document.getElementById("confirmation-coins-value").innerText = `Moedas: ${coins}`; // Atualiza moedas no menu

    // Garante que a mensagem de fundos insuficientes está escondida inicialmente
    // e o botão de comprar está habilitado quando o menu é aberto.
    insufficientFundsMessage.classList.add("hidden");
    insufficientFundsMessage.style.display = "none";
    buyButton.disabled = false;

    // A lógica de verificar moedas, desabilitar botão e tocar áudio foi movida para purchaseHat()

    confirmationMenu.classList.remove("hidden");
    confirmationMenu.style.display = "block"; // Garante que está visível
}   

function hideConfirmationMenu() {
    const confirmationMenu = document.getElementById("confirmation-menu");
    confirmationMenu.classList.add("hidden");
    confirmationMenu.style.display = "none"; // Garante que está escondido
    audioSairMenu.play(); // Adicione ou verifique esta linha
    //currentHatToBuyId = null;
    // Limpa a mensagem de fundos insuficientes para a próxima vez
    const insufficientFundsMessage = document.getElementById("insufficient-funds");
    insufficientFundsMessage.classList.add("hidden");
    insufficientFundsMessage.style.display = "none";
}

function purchaseHat() {
    if (!currentHatToBuyId) return;

    const hatData = hatsData[currentHatToBuyId];
    if (coins >= hatData.price) {
        coins -= hatData.price;
        hatData.purchased = true;
        updateDisplay();
        hideConfirmationMenu();

        // Esta linha já deve funcionar corretamente, pois .hat agora é a div
        const purchasedHatElement = document.querySelector(`.hat[data-id="${currentHatToBuyId}"]`);
        if (purchasedHatElement) {
            purchasedHatElement.classList.add('purchased');
            audioCompra.play();
        }
    } else {
        const insufficientFundsMessage = document.getElementById("insufficient-funds");
        insufficientFundsMessage.classList.remove("hidden");
        insufficientFundsMessage.style.display = "block";
        audioMoedaInsuficiente.play(); // Áudio de moeda insuficiente toca aqui
    }
}

function playSparkleEffect() {
    const sparkleElement = document.getElementById("sparkle-effect");
    if (sparkleElement) {
        // Para garantir que o GIF reinicie a cada vez, redefinimos o src.
        // Isso força o navegador a recarregar o GIF e reiniciar a animação.
        const originalSrc = sparkleElement.src;
        sparkleElement.src = ''; // Limpa o src temporariamente
        sparkleElement.src = originalSrc; // Redefine para o original

        sparkleElement.classList.remove("hidden"); // Mostra o GIF
        audioTrocaChapeu.play(); // Toca o efeito sonoro de troca de chapéu
        setTimeout(() => {
            sparkleElement.classList.add("hidden"); // Esconde o GIF após a duração
        }, SPARKLE_DURATION_MS);
    }
}

function updateCharacterHat(hatIdToEquip) {
    const characterElement = document.getElementById("character");
    let hatStateChanged = false; // Flag para saber se o estado do chapéu realmente mudou

    // Se o chapéu clicado é o mesmo que já está equipado, remove o chapéu
    if (hatIdToEquip && hatIdToEquip === currentlyEquippedHatId) {
        if (characterElement.src.endsWith("p_0.gif") === false) { // Só muda e toca efeito se não já estiver sem chapéu
            characterElement.src = "images/p_0.gif"; // Imagem base do personagem
            currentlyEquippedHatId = null; // Nenhum chapéu equipado
            hatStateChanged = true;
        }
    }
    // Se um chapéu diferente (e comprado) for clicado, equipa o novo chapéu
    else if (hatsData[hatIdToEquip] && hatsData[hatIdToEquip].purchased) {
        if (currentlyEquippedHatId !== hatIdToEquip) { // Só muda e toca efeito se for um chapéu diferente
            characterElement.src = hatsData[hatIdToEquip].characterImage;
            currentlyEquippedHatId = hatIdToEquip; // Atualiza o chapéu equipado
            hatStateChanged = true;
        }
    }
    // Se hatIdToEquip for null (para remover o chapéu programaticamente, se necessário)
    else if (hatIdToEquip === null && currentlyEquippedHatId !== null) {
        if (characterElement.src.endsWith("p_0.gif") === false) {
            characterElement.src = "images/p_0.gif"; // Imagem base do personagem
            currentlyEquippedHatId = null;
            hatStateChanged = true;
        }
    }

    if (hatStateChanged) {
        playSparkleEffect(); // Toca o efeito de brilho se o estado do chapéu mudou
    }
}

function setupCarousel() {
    const hatMenu = document.getElementById('hat-menu');
    const prevButton = document.getElementById('prev-hat-button');
    const nextButton = document.getElementById('next-hat-button');
    const hatElements = document.querySelectorAll('.hat');
    const totalHats = hatElements.length;

    if (totalHats === 0) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    }

    // Calcula a largura de um item do carrossel (chapéu + margens)
    const firstHat = hatElements[0];
    const style = window.getComputedStyle(firstHat);
    hatItemWidth = firstHat.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);

    // Define a largura do menu para exatamente 3 chapéus se não estiver no CSS
    // O CSS já define width: 210px, que é (50px + 20px margin) * 3
    // hatMenu.style.width = `${hatItemWidth * hatsPerPage}px`;


    function updateCarousel() {
        hatMenu.scrollLeft = currentCarouselIndex * hatItemWidth;
        prevButton.disabled = currentCarouselIndex === 0;
        nextButton.disabled = currentCarouselIndex >= totalHats - hatsPerPage || totalHats <= hatsPerPage;
    }

    prevButton.addEventListener('click', () => {
        if (currentCarouselIndex > 0) {
            currentCarouselIndex--;
            updateCarousel();
            audioCliqueCarrossel.play();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentCarouselIndex < totalHats - hatsPerPage) {
            currentCarouselIndex++;
            updateCarousel();
            audioCliqueCarrossel.play();
        }
    });

    // Inicializa o estado dos botões
    updateCarousel();
}


document.addEventListener("DOMContentLoaded", () => {
    startTimer();
    updateDisplay();

    const hatElements = document.querySelectorAll(".hat"); // Corrigido de hatImages para hatElements
    hatElements.forEach(hatElement => { // Corrigido de hatImageElement para hatElement
        hatElement.onclick = () => {
            const hatId = hatElement.dataset.id;
            if (!hatId) {
                console.warn("[hat.onclick] AVISO: Chapéu clicado não tem data-id.");
                return;
            }

            if (hatsData[hatId]) {
                if (hatsData[hatId].purchased) {
                    // Se o chapéu foi comprado, chama updateCharacterHat
                    // A função updateCharacterHat agora lida com equipar ou desequipar
                    updateCharacterHat(hatId);
                } else {
                    // Se não foi comprado, mostra o menu de confirmação
                    showConfirmationMenu(hatId);
                }
            } else {
                console.warn(`Dados para o chapéu ${hatId} não encontrados em hatsData.`);
                alert(`Informações do chapéu ${hatId} não encontradas.`);
            }
        };
    });

    document.getElementById("buy-button").onclick = purchaseHat;
    document.getElementById("cancel-button").onclick = hideConfirmationMenu;

    setupCarousel(); // Configura o carrossel
});