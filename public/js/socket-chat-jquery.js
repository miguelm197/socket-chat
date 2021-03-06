// Funciones para renderizar usuarios

var params = new URLSearchParams(window.location.search);
var nombre = params.get("nombre");
var sala = params.get("sala");

// Referencias JQuery
var divUsuarios = $("#divUsuarios");
var formEnviar = $("#formEnviar");
var txtMensaje = $("#txtMensaje");
var divChatbox = $("#divChatbox");

function renderizarUsuarios(personas) {
  console.log("Personaitas: ", personas);

  var html = `
    <li>
        <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get("sala")}</span></a>
    </li>
    `;

  personas.forEach((persona) => {
    html += `        
        <li>
            <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>
        </li> 
        `;
  });

  divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
  var fecha = new Date(mensaje.fecha);
  var hora = fecha.getHours() + ":" + fecha.getMinutes();
  var adminClass = mensaje.nombre === "Administrador" ? "danger" : "info";

  var html = "";
  if (yo) {
    html += '<li class="reverse">';
    html += '    <div class="chat-content">';
    html += "        <h5>" + mensaje.nombre + "</h5>";
    html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + "</div>";
    html += "    </div>";
    html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
    html += '    <div class="chat-time">' + hora + "</div>";
    html += "</li>";
  } else {
    html += "<li>";

    if (mensaje.nombre !== "Administrador") {
      html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    }
    html += '    <div class="chat-content">';
    html += "        <h5>" + mensaje.nombre + "</h5>";
    html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + "</div>";
    html += "    </div>";
    html += '    <div class="chat-time">' + hora + "</div>";
    html += "</li>";
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    divChatbox.scrollTop(scrollHeight);
  }
}

// Listeners
divUsuarios.on("click", "a", function () {
  var id = $(this).data("id");
  if (id) console.log(id);
});

formEnviar.on("submit", function (e) {
  e.preventDefault();

  if (txtMensaje.val().trim().length === 0) {
    return;
  }

  // console.log(txtMensaje.val());

  socket.emit(
    "crearMensaje",
    {
      nombre: nombre,
      mensaje: txtMensaje.val(),
    },
    function (mensaje) {
      txtMensaje.val("").focus();
      renderizarMensajes(mensaje, true);
      scrollBottom();
    }
  );
});
