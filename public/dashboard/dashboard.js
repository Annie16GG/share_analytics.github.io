// var filtParameters = "";
// const userId = localStorage.getItem("user_id");
// if(userId == '5dbf3cb3-8b87-4648-bb41-2a2b137d2fc9'){
//   filtParameters = "Categoria=Comida";
// }
// else if (userId == 'hola1'){
//   filtParameters = "Categoria=Despensa";
// }
// else if(userId == 'hola'){
//   filtParameters = "Categoria=Entretenimiento";
// }

// Función para verificar si hay una sesión activa
function checkSession() {
  const token = localStorage.getItem("authToken"); // Aquí buscamos el token en el localStorage
  if (!token) {
    // Si no hay token, redirigir a index.html
    window.location.href = "../index.html";
  }
}

// Llamamos a checkSession() al cargar la página
checkSession();

var dashboardId = "5655907d-2104-4b98-b152-7f88c99bab33";
var rootUrl = "https://login.shareanalytics.com.mx/bi";
var siteIdentifier = "site/acp";
var environment = "onpremise";
var embedType = "component";
var authorizationUrl = "https://dbd4-20-121-192-203.ngrok-free.app/embeddetail/get";
// var authorizationUrl = "http://localhost:8080/embeddetail/get";
// var authorizationUrl = "https://api-boldbi.vercel.app/api/embeddetail/get";
let selectedAccess = null;
let selectedEntity = null;
let selectedScope = null;
const addUserModal = document.getElementById("addUserModal");
const addUnidadModal = document.getElementById("addUnidadModal");
const addUserButton = document.getElementById("addUserButton");
const addUnityButton = document.getElementById("addUnityButton");
const addTareaButton = document.getElementById("addTareaButton");
const addEstudButton = document.getElementById("addEstudButton");
const addTaskButton = document.getElementById("addTareaAButton");
const addUnidadButton = document.getElementById("addUnidadButton");
const addPermissionModal = document.getElementById("addPermissionModal");
const addPermissionButton = document.getElementById("addPermissionButton");
const closeModal = document.getElementsByClassName("close")[0];
const modal = document.getElementById("addFormModal");
const btn = document.getElementById("addFormButton");
const span = document.getElementsByClassName("close")[0];
const closeModalButtons = document.querySelectorAll(".close");
const editUserModal = document.getElementById("editUserModal");
const addForm = document.getElementById("addForm");
const formFieldsContainer = document.getElementById("formFieldsContainer");
const addFieldButton = document.getElementById("addFieldButton");
const addFormModal = document.getElementById("addFormModal");
const closeBtn = document.querySelector(".close");
const addCategoryModal = document.getElementById("addCategoryModal");
const addCategoryButton = document.getElementById("CategoryButton");
const selectGroupModal = document.getElementById("selectGroupModal");
const closeModalButton = selectGroupModal.querySelector(".close");
const tabButtons = selectGroupModal.querySelectorAll(".tab-button");
const tabContents = selectGroupModal.querySelectorAll(".tab-content");
const addGroupButton = document.getElementById("addGroupButton");
const existingGroupSelect = document.getElementById("existingGroupSelect");
const validationFunctions = {
  25: validateBitacoraTelcel,
  27: validateBitacoraTelcel_v2,
  1125899906842625: validateCargaHoras,
  2251799813685249: validaCalendario,
  2251799813685250: validaAsignacion,
  2251799813685251: validaCoordenadas,
  1125899906842626: validaVehiculos,

  otro_formulario: validateOtroFormulario,
  // Agrega más formularios y funciones aquí...
};
addUserButton.onclick = function () {
  addUserModal.style.display = "block";
};
addUnityButton.onclick = function () {
  addUnidadModal.style.display = "block";
};

addTareaButton.onclick = function () {
  addTareaModal.style.display = "block";
};

addEstudButton .onclick = function () {
  addEstudianteModal.style.display = "block";
};

addTareaAButton .onclick = function () {
  addTaskModal.style.display = "block";
};

addPermissionButton.onclick = function () {
  addPermissionModal.style.display = "block";
  selectedAccess = null;
  selectedEntity = null;
  selectedScope = null;
  handleRadioChange();
  loadEntities();
  loadScope();
};
closeModal.onclick = function () {
  addUserModal.style.display = "none";
  addUnidadModal.style.display = "none";
  addFormModal.style.display = "none";
  selectGroupModal.style.display = "none";
  addTareaModal.style.display = "none";
  addEstudianteModal.style.display = "none";
  addTaskModal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == addUserModal) {
    addUserModal.style.display = "none";
  }
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
closeModalButtons.forEach((button) => {
  button.onclick = function () {
    const modal = button.closest(".modal");
    if (modal) {
      modal.style.display = "none";
    }
  };
});
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};
document.addEventListener("DOMContentLoaded", () => {
  const initialLabelInput = document.querySelector(".fieldLabel");
  const initialNameInput = document.querySelector(".fieldName");
  initialLabelInput.addEventListener("input", () => {
    initialNameInput.value = initialLabelInput.value
      .toLowerCase()
      .replace(/\s+/g, "_");
  });
});
addFieldButton.onclick = () => {
  const fieldDiv = document.createElement("div");
  fieldDiv.classList.add("formField");

  const labelInput = document.createElement("input");
  labelInput.setAttribute("type", "text");
  labelInput.classList.add("fieldLabel");
  labelInput.required = true;

  const labelField = document.createElement("label");
  labelField.textContent = "Etiqueta del Campo:";
  fieldDiv.appendChild(labelField);
  fieldDiv.appendChild(labelInput);

  const selectField = document.createElement("select");
  selectField.classList.add("fieldType");
  selectField.required = true;
  const options = ["text", "number", "email", "date", "time", "checkbox"];
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    selectField.appendChild(opt);
  });

  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Tipo del Campo:";
  fieldDiv.appendChild(typeLabel);
  fieldDiv.appendChild(selectField);

  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.classList.add("fieldName");
  nameInput.required = true;
  nameInput.readOnly = true;

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre del Campo:";
  fieldDiv.appendChild(nameLabel);
  fieldDiv.appendChild(nameInput);

  formFieldsContainer.appendChild(fieldDiv);

  labelInput.addEventListener("input", () => {
    nameInput.value = labelInput.value.toLowerCase().replace(/\s+/g, "_");
  });
};
addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formName = document.getElementById("formName").value;
  const fields = [];

  formFieldsContainer.querySelectorAll(".formField").forEach((fieldDiv) => {
    const label = fieldDiv.querySelector(".fieldLabel").value;
    const type = fieldDiv.querySelector(".fieldType").value;
    const name = fieldDiv.querySelector(".fieldName").value;

    fields.push({ label, type, name });
  });

  const formFieldsJSON = JSON.stringify({ fields });

  fetch("/api/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: formName, config: formFieldsJSON }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Formulario guardado exitosamente");
        addForm.reset();
        formFieldsContainer.innerHTML = ""; // Limpiar campos dinámicos
        addFormModal.style.display = "none";
      } else {
        alert("Error al guardar el formulario: " + result.error);
      }
    })
    .catch((error) => console.error("Error:", error));
});

document
  .getElementById("CategoryButton")
  .addEventListener("click", function () {
    addCategoryModal.style.display = "block";
  });
document.getElementById("signOut").addEventListener("click", (event) => {
  event.preventDefault();

  // Eliminar token de autenticación de localStorage
  localStorage.removeItem("authToken");

  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = "../index.html";
});
document
  .getElementById("selectedActionButton")
  .addEventListener("click", function () {
    selectGroupModal.style.display = "block";
    loadExistingGroups();
  });
tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    const targetTab = button.getAttribute("data-tab");
    document.getElementById(targetTab).classList.add("active");
  });
});
addGroupButton.addEventListener("click", function () {
  const activeTab = document.querySelector(".tab-content.active");
  let groupData;

  if (activeTab.id === "new-group") {
    const groupName = document.getElementById("groupName").value;
    const groupDescription = document.getElementById("groupDescription").value;
    groupData = { name: groupName, description: groupDescription };

    const selectedUserIds = getSelectedUserIds();
    groupData.users = selectedUserIds;

    fetch("/api/groups/group/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Grupo añadido:", data);
        selectGroupModal.style.display = "none"; // Cerrar modal
      })
      .catch((error) => console.error("Error adding group:", error));
  } else if (activeTab.id === "existing-group") {
    const selectedGroupId = document.getElementById(
      "existingGroupSelect"
    ).value;
    groupData = { id: selectedGroupId };

    const selectedUserIds = getSelectedUserIds();
    groupData.users = selectedUserIds;

    fetch("/api/groups/group/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Grupo añadido:", data);
        selectGroupModal.style.display = "none"; // Cerrar modal
      })
      .catch((error) => console.error("Error adding group:", error));
  }

  // Enviar datos al backend (reemplaza con tu endpoint real)
});
window.addEventListener("click", function (event) {
  if (event.target === selectGroupModal) {
    selectGroupModal.style.display = "none";
  }
});
closeModalButton.addEventListener("click", function () {
  selectGroupModal.style.display = "none";
});
addCategoryButton.addEventListener("click", function () {
  let groupData;

  const categoryName = document.getElementById("categoryName").value;
  const categoryDescription = document.getElementById(
    "categoryDescription"
  ).value;
  groupData = { name: categoryName, description: categoryDescription };

  fetch("/api/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Categoria añadida:", data);
      addCategoryModal.style.display = "none"; // Cerrar modal
    })
    .catch((error) => console.error("Error adding group:", error));

  // Enviar datos al backend (reemplaza con tu endpoint real)
});
document.querySelectorAll('input[name="category"]').forEach((radio) => {
  radio.addEventListener("change", handleRadioChange);
});
document
  .getElementById("addPermissionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userId = document.getElementById("userIdInput").value;
    const entity = selectedEntity; // Assuming the first selected entity
    const scope = selectedScope; // Assuming the first selected scope
    const access_mode = selectedAccess; // Assuming the first selected access_mode

    const permissionData = {
      id_user: userId,
      entity: entity,
      scope: scope,
      access_mode: access_mode,
    };

    fetch("/api/perm/permission/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissionData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Permission added:", data);
        // Handle success, e.g., close the modal, refresh the permissions list, etc.
        loadPermisos(userId);
        addPermissionModal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error adding permission:", error);
        // Handle error
      });
  });
document
  .getElementById("editUserForm")
  .addEventListener("submit", submitEditUserForm);
document
  .getElementById("editUnidadForm")
  .addEventListener("submit", submitEditUnidadForm);
document
  .getElementById("updateAsignacionViajeForm")
  .addEventListener("submit", submitEditViajeForm);
document
  .getElementById("eventForm")
  .addEventListener("submit", submitEventoForm);
document
  .getElementById("costForm")
  .addEventListener("submit", submitCostosForm);
document
  .getElementById("addRazonForm")
  .addEventListener("submit", submitBloqueoForm);
document
  .getElementById("editTareaModal")
  .addEventListener("submit", submitEditTareaForm);
  document
  .getElementById("editEstudModal")
  .addEventListener("submit", submitEditEstudForm);

  document
  .getElementById("editTaskModal")
  .addEventListener("submit", submitEditTaskForm);

document
  .getElementById("addPermissionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const userId = document.getElementById("userIdInput").value;
    const entity = selectedEntity; // Assuming the first selected entity
    const scope = selectedScope; // Assuming the first selected scope
    const access_mode = selectedAccess; // Assuming the first selected access_mode

    const permissionData = {
      id_user: userId,
      entity: entity,
      scope: scope,
      access_mode: access_mode,
    };

    fetch("/api/perm/permission/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissionData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Permission added:", data);
        // Handle success, e.g., close the modal, refresh the permissions list, etc.
        loadPermisos(userId);
        addPermissionModal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error adding permission:", error);
        // Handle error
      });
  });
document.getElementById("addForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const formName = document.getElementById("formName").value;
  const formFields = document.getElementById("formFields").value;

  fetch("/api/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: formName, config: formFields }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Formulario añadido exitosamente");
        modal.style.display = "none";
        loadForms(); // Recargar la lista de formularios
      } else {
        alert("Error al añadir el formulario: " + data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
});
document.getElementById("menu-dashboard").addEventListener("click", () => {
  showView("dashboard-view");
  addCategoryButton.style.display = "block";
  loadDashboards();
});
document.getElementById("menu-upload").addEventListener("click", () => {
  showView("upload-view");
  loadForms();
});
document.getElementById("menu-users").addEventListener("click", () => {
  showView("users-view");
  loadUsers(); // Cargar y mostrar los usuarios
  document
    .querySelector("#users-table tbody")
    .addEventListener("change", function (e) {
      if (e.target && e.target.matches(".user-checkbox")) {
        toggleActionButton();
      }
    });
  document
    .getElementById("selectedActionButton")
    .addEventListener("click", function () {});
});
document.getElementById("menu-unidades").addEventListener("click", () => {
  showView("unidades-view");
  loadUnidades(); // Cargar y mostrar los usuarios
  document
    .querySelector("#unidades-table tbody")
    .addEventListener("change", function (e) {
      if (e.target && e.target.matches(".user-checkbox")) {
        toggleActionButton();
      }
    });
  document
    .getElementById("selectedActionButton")
    .addEventListener("click", function () {});
});

document.getElementById("menu-estudiantes").addEventListener("click", () => {
  showView("estudiantes-view");
  loadEstudiantes();
  document
    .querySelector("#estudiantes-table tbody")
    .addEventListener("change", function (e) {
    });
  document
    .getElementById("selectedActionButton")
    .addEventListener("click", function () {});
});

document.getElementById("menu-team-agile").addEventListener("click", () => {
  showView("agile-view");
  loadTareas_Agile();
  document
    .querySelector("#agile-table tbody")
    .addEventListener("change", function (e) {
    });
  document
    .getElementById("selectedActionButton")
    .addEventListener("click", function () {});
});
document.getElementById("menu-tareas").addEventListener("click", () => {
  const tipoUser = localStorage.getItem("userRole");
  // backToUsersButton.style.display = 'inline';
  // // Ocultar el botón de añadir formulario si el rol es Visualizador y carga
  if (tipoUser === "ACP-Desarrollo") {
    addTareaButton.style.display = "none";
  }
  showView("tareas-view");
  loadTareas(); // Cargar y mostrar los usuarios
  document
    .querySelector("#tareas-table tbody")
    .addEventListener("change", function (e) {
      if (e.target && e.target.matches(".user-checkbox")) {
        toggleActionButton();
      }
    });
  document
    .getElementById("selectedActionButton")
    .addEventListener("click", function () {});
});

document.getElementById("signOut").addEventListener("click", () => {
  localStorage.removeItem("authToken");
  window.location.href = "../index.html";
});
document
  .querySelectorAll("#upload-view .sidebar.secondary-sidebar ul li")
  .forEach((item, index) => {
    item.addEventListener("click", () => {
      // Aquí puedes cargar y mostrar dinámicamente el contenido del formulario según el índice o identificador
      const formIndex = index + 1; // Ajustar según tu lógica de datos
      const formularioContainer = document.getElementById("formulario");
      formularioContainer.innerHTML = `Aquí puedes cargar el contenido del Formulario ${formIndex}`;
    });
  });
document
  .getElementById("addUserForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      id: generateUUID(),
      name: document.getElementById("name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      user: document.getElementById("user").value,
      status: document.getElementById("status").value,
      verification: document.getElementById("verification").value,
      image_url: document.getElementById("image_url").value,
      tipo_user: document.getElementById("tipo_user").value,
    };

    fetch("/api/auth/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        addUserModal.style.display = "none";
        loadUsers(); // Recargar la lista de usuarios
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

document
  .getElementById("addUnidadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      placas: document.getElementById("U_Placas").value,
      estado: document.getElementById("U_Estado").value,
      fecha: document.getElementById("U_FechaDeCompra").value,
      carga: document.getElementById("U_CargaMax").value,
    };

    // Usar SweetAlert2 para la confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas agregar esta unidad?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agregarla",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer el fetch
        fetch("/api/auth/unidades", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            Swal.fire(
              "Unidad agregada!",
              "La unidad ha sido agregada exitosamente.",
              "success"
            );
            addUnidadModal.style.display = "none"; // Cerrar el modal
            loadUnidades(); // Recargar la lista de unidades
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al agregar la unidad.",
              "error"
            );
          });
      }
    });
  });

document
  .getElementById("addTareaModal")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      titulo: document.getElementById("Titulo").value,
      descripcion: document.getElementById("Descripcion").value,
      proyecto: document.getElementById("Proyecto").value,
      tipo_tarea: document.getElementById("Tipo_tarea").value,
      categoria: document.getElementById("Categoria").value,
      alcance: document.getElementById("Alcance").value,
      prioridad: document.getElementById("Prioridad").value,
      asignado: document.getElementById("Asignado").value,
      estatus: document.getElementById("Estatus").value,
      puntos: document.getElementById("Puntos_historia").value,
      fecha_ini: document.getElementById("Fecha_inicio_sprint").value,
      sprint: document.getElementById("Key_Sprint").value,
      fecha_ini_lib: document.getElementById("Fecha_inicio_lib").value,
      fecha_lib_sprint: document.getElementById("Fecha_lib_Sprint").value,
      fecha_final: document.getElementById("Fecha_final_lib").value,
      entregable: document.getElementById("Entregable").value,
      satisfaccion: document.getElementById("Puntaje_satisfaccion").value,
    };

    // Usar SweetAlert2 para la confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas agregar esta tarea?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agregarla",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer el fetch
        fetch("/api/tareas/agregarTarea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            Swal.fire(
              "Tarea agregada!",
              "La tarea ha sido agregada exitosamente.",
              "success"
            );
            addTareaModal.style.display = "none"; // Cerrar el modal
            loadTareas(); // Recargar la lista de unidades
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al agregar la tarea.",
              "error"
            );
          });
      }
    });
  });

  document
  .getElementById("addEstudianteModal")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Capturar los datos del formulario
    const formData = {
      student_name: document.getElementById("Student_Name").value.trim(),
      year: parseInt(document.getElementById("Year").value, 10),
      gender: document.getElementById("Gender").value.trim(),
      grade_id: parseInt(document.getElementById("Grade_Id").value, 10),
      fees: parseFloat(document.getElementById("Fees").value),
      date_enrolment: document.getElementById("Date_Enrolment").value,
      student_satisfaction: parseInt(
        document.getElementById("student_satisfaction").value,
        10
      ),
      parent_satisfaction: parseInt(
        document.getElementById("parent_satisfaction").value,
        10
      ),
    };

    // Confirmación con SweetAlert2
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas agregar este estudiante?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agregarlo",
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviar los datos al backend
        fetch("/api/estudiantes/agregarEstudiante", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            Swal.fire(
              "Estudiante agregado!",
              "El estudiante ha sido agregado exitosamente.",
              "success"
            );
            document.getElementById("addEstudianteModal").style.display = "none"; // Cerrar el modal
            loadEstudiantes(); // Recargar la lista de estudiantes
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al agregar el estudiante.",
              "error"
            );
          });
      }
    });
  });

  document
  .getElementById("addTaskForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Capturar los datos del formulario
    const formData = {
      proyect_type: document.getElementById("Proyect_Type").value,
      team_member: document.getElementById("Team_Member").value.trim(),
      task_status: document.getElementById("Task_Status").value.trim(),
      task_type: document.getElementById("Task_Type").value.trim(),
      task_story_points: parseInt(
        document.getElementById("Task_StoryPoints").value,
        10
      ),
      resource_role: document.getElementById("Resource_Role").value.trim(),
      assigned_date: document.getElementById("Assigned_Date").value,
      closed_date: document.getElementById("Closed_Date").value,
      planned_hours: parseFloat(
        document.getElementById("Planned_Hours").value
      ),
      worked_hours: parseFloat(
        document.getElementById("Worked_Hours").value
      ),
      task_priority: document.getElementById("Task_Priority").value.trim(),
      total_resource: parseFloat(
        document.getElementById("Total_Resource").value
      ),
    };
    console.log(formData)

    // Confirmación con SweetAlert2
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas agregar esta tarea?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agregarla",
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviar los datos al backend
        fetch("/api/agile/agregarTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Éxito:", data);
            Swal.fire(
              "¡Tarea agregada!",
              "La tarea ha sido agregada exitosamente.",
              "success"
            );
            document.getElementById("addTaskModal").style.display = "none"; // Cerrar el modal
            loadTareas_Agile(); // Recargar la lista de tareas
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al agregar la tarea.",
              "error"
            );
          });
      }
    });
  });


document
  .getElementById("addAsignacionViajeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const estadoISO = {
      Aguascalientes: "AGU",
      BajaCalifornia: "BCN",
      "BajaCalifornia Sur": "BCS",
      Campeche: "CAM",
      CDMX: "CMX",
      Chiapas: "CHP",
      Chihuahua: "CHH",
      Coahuila: "COA",
      Colima: "COL",
      Durango: "DUR",
      Guanajuato: "GUA",
      Guerrero: "GRO",
      Hidalgo: "HID",
      Jalisco: "JAL",
      EdoMex: "MEX",
      Michoacan: "MIC",
      Morelos: "MOR",
      Nayarit: "NAY",
      NuevoLeon: "NLE",
      Oaxaca: "OAX",
      Puebla: "PUE",
      Querétaro: "QUE",
      QuintanaRoo: "ROO",
      SanLuisPotosí: "SLP",
      Sinaloa: "SIN",
      Sonora: "SON",
      Tabasco: "TAB",
      Tamaulipas: "TAM",
      Tlaxcala: "TLA",
      Veracruz: "VER",
      Yucatán: "YUC",
      Zacatecas: "ZAC",
    };

    const estadoOrigen = document.getElementById("V_EstadoOrigen").value;
    const estadoDestino = document.getElementById("V_EstadoDestino").value;

    // Obtener los códigos ISO de 3 dígitos
    const codigoOrigen = estadoISO[estadoOrigen];
    const codigoDestino = estadoISO[estadoDestino];

    // Crear el V_NOM automáticamente
    const V_NOM = `${codigoOrigen}-${codigoDestino}`;

    const formData = {
      placas: document.getElementById("addU_Placas").value,
      viaje: document.getElementById("V_KeyViaje").value,
      operador: document.getElementById("V_Operador").value,
      estadoOr: estadoOrigen,
      estadoDe: estadoDestino,
      V_NOM: V_NOM, // Agregar V_NOM calculado
      fInicio: document.getElementById("V_FInicio").value,
      fFin: null,
      costo: document.getElementById("V_Costo").value,
      ingreso: document.getElementById("V_Ingreso").value,
      carga: document.getElementById("V_CargaUtilizada").value,
      estatus: document.getElementById("V_Status").value,
    };

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas agregar este viaje?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agregarlo",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/api/viaje/viajes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            Swal.fire(
              "Viaje agregado!",
              "El viaje ha sido agregado exitosamente.",
              "success"
            );
            addAsignacionViajeModal.style.display = "none";
            loadUnidades(); // Recargar la lista de usuarios
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al agregar el viaje.",
              "error"
            );
          });
      }
    });
  });
document.addEventListener("DOMContentLoaded", showMenuBasedOnRole);
document.addEventListener("DOMContentLoaded", () => {
  const permissionView = document.getElementById("permission-view");
  const usersView = document.getElementById("users-view");
  const tipoUser = localStorage.getItem("userRole");
  // backToUsersButton.style.display = 'inline';
  // // Ocultar el botón de añadir formulario si el rol es Visualizador y carga
  if (tipoUser === "Visualizador y carga") {
    addFormButton.style.display = "none";
  }
  // Manejar el clic en el botón de retroceso
  backToUsersButton.addEventListener("click", () => {
    permissionView.style.display = "none";
    usersView.style.display = "block";
  });
});
showView("dashboard-view");
// Cargar grupos existentes en el select
function loadExistingGroups() {
  fetch("/api/groups/group") // Reemplaza con tu endpoint real
    .then((response) => response.json())
    .then((groups) => {
      console.log(groups); // Verifica los datos recibidos
      existingGroupSelect.innerHTML = ""; // Limpiar opciones anteriores
      groups.forEach((group) => {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = group.name_group;
        existingGroupSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching groups:", error));
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function toggleActionButton() {
  const selectedCheckboxes = document.querySelectorAll(
    ".user-checkbox:checked"
  );
  const actionButton = document.getElementById("selectedActionButton");

  if (selectedCheckboxes.length > 0) {
    actionButton.style.display = "inline-block"; // Mostrar el botón
  } else {
    actionButton.style.display = "none"; // Ocultar el botón
  }
}
function submitEditUserForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const editUserId = document.getElementById("editUserId").value;
  const editName = document.getElementById("editName").value;
  const editLastName = document.getElementById("editLastName").value;
  const editEmail = document.getElementById("editEmail").value;
  const editUser = document.getElementById("editUser").value;
  const editStatus = document.getElementById("editStatus").value;
  const editVerification = document.getElementById("editVerification").value;
  const editImageUrl = document.getElementById("editImageUrl").value;
  const editTipoUser = document.getElementById("editTipoUser").value;

  const updatedUser = {
    id: editUserId,
    name: editName,
    last_name: editLastName,
    email: editEmail,
    user: editUser,
    status: editStatus,
    verification: editVerification,
    image_url: editImageUrl,
    tipo_user: editTipoUser,
  };

  // Mostrar alerta de confirmación antes de realizar la acción
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción actualizará los datos del usuario.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, proceder con la actualización
      fetch(`/api/auth/users/${editUserId}`, {
        method: "PUT", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire(
            "Actualizado",
            "Los datos del usuario han sido actualizados.",
            "success"
          );
          // Cerrar el modal
          document.getElementById("editUserModal").style.display = "none";
          loadUsers(); // Refrescar la lista de usuarios o actualizar la UI según sea necesario
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire(
            "Error",
            "Hubo un problema al actualizar los datos de la unidad.",
            "error"
          );
        });
    }
  });
}
function submitEditUnidadForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const editPlacas = document.getElementById("editU_Placas").value;
  const editEstado = document.getElementById("editU_Estado").value;
  const editFecha = document.getElementById("editU_FechaDeCompra").value;
  const editCarga = document.getElementById("editU_CargaMax").value;
  const editStatus = document.getElementById("editU_Status").value;

  const updatedUser = {
    placas: editPlacas,
    estado: editEstado,
    fecha: editFecha,
    carga: editCarga,
    status: editStatus,
  };
  console.log(updatedUser);

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción actualizará los datos de la unidad.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/auth/unidades/${editUserId}`, {
        method: "PUT", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          Swal.fire(
            "Actualizado",
            "Los datos de la unidad han sido actualizados.",
            "success"
          );
          // Cerrar el modal
          document.getElementById("editUnidadModal").style.display = "none";
          loadUnidades(); // Opcional: refrescar la lista de usuarios o actualizar la UI según sea necesario
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire(
            "Error",
            "Hubo un problema al actualizar los datos de la unidad.",
            "error"
          );
        });
    }
  });
}
function submitEditViajeForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const editPlacas = document.getElementById("updateU_Placas").value;
  const editviaje = document.getElementById("upadateV_KeyViaje").value;
  const editfin = document.getElementById("updateV_FFin").value;
  const editstatus = document.getElementById("updateV_Status").value;

  const updatedUser = {
    placas: editPlacas,
    viaje: editviaje,
    fin: editfin,
    status: editstatus,
  };
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción finalizara el viaje.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/viaje/viajes/${editPlacas}`, {
        method: "PUT", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire("Actualizado", "El viaje ha finalizado.", "success");
          // Cerrar el modal
          document.getElementById("updateAsignacionViajeModal").style.display =
            "none";
          document.getElementById("C_Placas").value = editPlacas;
          document.getElementById("C_KeyViaje").value = editviaje;
          document.getElementById("costosModal").style.display = "block";
          loadUnidades();
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire(
            "Error",
            "Hubo un problema al finalizar el viaje.",
            "error"
          );
        });
    }
  });
}
function submitEventoForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const evPlacas = document.getElementById("E_Placas").value;
  const evTipo = document.getElementById("E_Tipo").value;
  const evFecha = document.getElementById("E_FechaEvento").value;
  const evMonto = document.getElementById("E_Monto").value;

  const updatedUser = {
    placas: evPlacas,
    tipo: evTipo,
    fecha: evFecha,
    monto: evMonto,
  };
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción añadira un evento.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, Añadir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/viaje/eventos`, {
        method: "POST", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire("Actualizado", "El evento ha sido añadido.", "success");
          // Cerrar el modal
          document.getElementById("eventoModal").style.display = "none";
          loadUnidades(); // Opcional: refrescar la lista de usuarios o actualizar la UI según sea necesario
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire("Error", "Hubo un problema al añadir el evento.", "error");
        });
    }
  });
}
function submitBloqueoForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const tarea = document.getElementById("T_KeyTarea").value;
  const razon = document.getElementById("Razon").value;

  const Bloqueo = {
    id_tarea: tarea,
    razon: razon,
  };
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción añadira un bloqueo.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, Añadir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/tareas/agregarBloqueo`, {
        method: "POST", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Bloqueo),
      })
        .then((response) => response.json())
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire("Agregado", "El bloqueo ha sido añadido.", "success");
          // Cerrar el modal
          document.getElementById("addRazonModal").style.display = "none";
          loadTareas(); // Opcional: refrescar la lista de usuarios o actualizar la UI según sea necesario
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire("Error", "Hubo un problema al añadir el bloqueo.", "error");
        });
    }
  });
}

function submitEditTareaForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const keyTarea = document.getElementById("editT_KeyTarea").value;
  const tareaEstatus = document.getElementById("editEstatus").value;
  const tareaSatisfaccion = document.getElementById(
    "editPuntaje_satisfaccion"
  ).value;

  const updatedTarea = {
    idtarea: keyTarea,
    estatust: tareaEstatus,
    satist: tareaSatisfaccion
  };
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción modificara la tarea.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/tareas/modificarTarea/${keyTarea}`, {
        method: "PUT", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTarea),
      })
        .then((response) => response.json())
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire("Actualizado", "La tarea se ha modificado.", "success");
          // Cerrar el modal
          document.getElementById("editTareaModal").style.display = "none";
          // document.getElementById("C_Placas").value = editPlacas;
          // document.getElementById("C_KeyViaje").value = editviaje;
          // document.getElementById("costosModal").style.display = "block";
          loadTareas();
        })
        .catch((error) => {
          console.error("Error updating tarea details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire(
            "Error",
            "Hubo un problema al modificar la tarea.",
            "error"
          );
        });
    }
  });
}

function submitEditEstudForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const studentId = document.getElementById("editStudentId").value;
  const studentName = document.getElementById("editStudentName").value;
  const studentYear = document.getElementById("editYear").value;
  const studentGender = document.getElementById("editGender").value;
  const studentGradeId = document.getElementById("editGradeId").value;
  const studentFees = document.getElementById("editFees").value;
  const studentDateEnrolment = document.getElementById("editDateEnrolment").value;
  const studentDroppedOut = document.getElementById("editDroppedOut").value;
  const studentSatisfaction = document.getElementById("editStudentSatisfaction").value;
  const parentSatisfaction = document.getElementById("editParentSatisfaction").value;

  const updatedStudent = {
    Student_Id: studentId,
    Student_Name: studentName,
    Year: studentYear,
    Gender: studentGender,
    Grade_Id: studentGradeId,
    Fees: studentFees,
    Date_Enrolment: studentDateEnrolment,
    dropped_out: studentDroppedOut,
    student_satisfaction: studentSatisfaction,
    parent_satisfaction: parentSatisfaction
  };

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción modificará los detalles del estudiante.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/estudiantes/modificarStudent/${studentId}`, {
        method: "PUT", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      })
        .then((response) => response.json())
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire("Actualizado", "Los detalles del estudiante se han modificado.", "success");
          // Cerrar el modal
          document.getElementById("editEstudModal").style.display = "none";
          loadEstudiantes(); // Asegúrate de cargar los estudiantes de nuevo si es necesario
        })
        .catch((error) => {
          console.error("Error updating student details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire("Error", "Hubo un problema al modificar los detalles del estudiante.", "error");
        });
    }
  });
}

function submitEditTaskForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const taskId = document.getElementById("editTaskId").value;
  const projectType = document.getElementById("editProjectType").value;
  const teamMember = document.getElementById("editTeamMember").value;
  const taskStatus = document.getElementById("editTaskStatus").value;
  const taskType = document.getElementById("editTaskType").value;
  const storyPoints = document.getElementById("editStoryPoints").value;
  const resourceRole = document.getElementById("editResourceRole").value;
  const assignedDate = document.getElementById("editAssignedDate").value;
  const closedDate = document.getElementById("editClosedDate").value;
  const plannedHours = document.getElementById("editPlannedHours").value;
  const workedHours = document.getElementById("editWorkedHours").value;
  const taskPriority = document.getElementById("editTaskPriority").value;
  const totalResource = document.getElementById("editTotalResource").value;
  const score = document.getElementById("editScore").value;

  const updatedTask = {
    Task_ID: taskId,
    Proyect_Type: projectType,
    Team_Member: teamMember,
    Task_Status: taskStatus,
    Task_Type: taskType,
    Task_StoryPoints: storyPoints,
    Resource_Role: resourceRole,
    Assigned_Date: assignedDate,
    Closed_Date: closedDate,
    Planned_Hours: plannedHours,
    Worked_Hours: workedHours,
    Task_Priority: taskPriority,
    Total_Resource: totalResource,
    Score: score,
  };

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción modificará los detalles de la tarea.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/agile/modificarTask/${taskId}`, {
        method: "PUT", // Método HTTP para actualizar datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar la tarea");
          }
          return response.json();
        })
        .then((data) => {
          // Mostrar alerta de éxito si se actualizó correctamente
          Swal.fire("Actualizado", "Los detalles de la tarea se han modificado.", "success");
          // Cerrar el modal
          document.getElementById("editTaskModal").style.display = "none";
          loadTareas_Agile(); // Asegúrate de cargar las tareas de nuevo si es necesario
        })
        .catch((error) => {
          console.error("Error updating task details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire("Error", "Hubo un problema al modificar los detalles de la tarea.", "error");
        });
    }
  });
}


function submitCostosForm(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  // Recoger las placas y el keyViaje
  const placas = document.getElementById("C_Placas").value;
  const keyViaje = document.getElementById("C_KeyViaje").value;

  // Recoger los valores de todas las filas dinámicas
  const categorias = Array.from(
    document.querySelectorAll("select[name='C_Categoria[]']")
  ).map((select) => select.value);
  const tipos = Array.from(
    document.querySelectorAll("select[name='C_Tipo[]']")
  ).map((select) => select.value);
  const montos = Array.from(
    document.querySelectorAll("input[name='C_Monto[]']")
  ).map((input) => parseFloat(input.value));

  // Verificar que todas las filas tengan los valores completos
  const costos = categorias.map((categoria, index) => ({
    categoria,
    tipo: tipos[index],
    monto: montos[index],
  }));

  // Crear el objeto a enviar
  const data = {
    placas,
    keyViaje,
    costos,
  };

  // Mostrar alerta de confirmación antes de realizar la acción
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción registrara los costos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/viaje/costos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          Swal.fire(
            "Actualizado",
            "Los costos han sido registrados.",
            "success"
          );
          document.getElementById("costosModal").style.display = "none";
          loadUnidades();
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          // Mostrar alerta de error si algo salió mal
          Swal.fire(
            "Error",
            "Hubo un problema al registrar los costos.",
            "error"
          );
        });
    }
  });
}
const deleteUser = async (userId) => {
  try {
    const response = await fetch(`/api/auth/users/${userId}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (response.ok) {
      loadUsers();
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
const deleteUnidad = async (placa) => {
  // Mostrar mensaje de confirmación con SweetAlert
  const confirmResult = await Swal.fire({
    title: "¿Estás seguro?",
    text: `Esta acción eliminará la unidad con placas ${placa}. ¿Deseas continuar?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  // Verificar si el usuario confirmó la eliminación
  if (!confirmResult.isConfirmed) {
    return; // Si no se confirma, se detiene la ejecución
  }

  try {
    const response = await fetch(`/api/auth/unidades/${placa}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (response.ok) {
      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        title: "Eliminado",
        text: "La unidad ha sido eliminada correctamente.",
        icon: "success",
      });
      loadUnidades(); // Recargar las unidades después de la eliminación
    } else {
      // Mostrar mensaje de error con SweetAlert
      Swal.fire({
        title: "Error",
        text: result.message || "No se pudo eliminar la unidad.",
        icon: "error",
      });
      console.error(result.message);
    }
  } catch (error) {
    // Mostrar mensaje de error en caso de fallo en la solicitud
    Swal.fire({
      title: "Error",
      text: "Hubo un problema al intentar eliminar la unidad.",
      icon: "error",
    });
    console.error("Error deleting user:", error);
  }
};
const FinalizarTarea = async (tareaId) => {
  // Confirmación con SweetAlert2 antes de finalizar la tarea
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas finalizar esta tarea?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, finalizar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Obtener la fecha y hora actual en formato ISO
      const fechaTermino = new Date().toISOString();

      try {
        const response = await fetch(`/api/tareas/finalizar/${tareaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fecha_termino: fechaTermino }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire(
            "Tarea finalizada",
            "La tarea ha sido finalizada exitosamente.",
            "success"
          );
          loadUsers(); // Recargar la lista de tareas o usuarios
        } else {
          Swal.fire(
            "Error",
            "Ocurrió un error al finalizar la tarea.",
            "error"
          );
          console.error(result.message);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Ocurrió un error de conexión al intentar finalizar la tarea.",
          "error"
        );
        console.error("Error al finalizar tarea:", error);
      }
    }
  });
};
function openPermissionsModal(userId) {
  showView("permission-view");
  loadPermisos(userId);

  // Set the userId in a hidden input field within the form
  const userIdInput = document.getElementById("userIdInput");
  userIdInput.value = userId;
}
function loadPermisos(userId) {
  fetch(`/api/auth/permisos/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#permissionsTable tbody");
      tbody.innerHTML = "";
      data.forEach((permiso) => {
        // Verificar cada campo para asegurarse de que no sea null
        const entity = permiso.entity !== null ? permiso.entity : "";
        const scope = permiso.scope !== null ? permiso.scope : "";
        const accessMode =
          permiso.access_mode !== null ? permiso.access_mode : "";

        // Si no quieres agregar una fila para registros con campos nulos, puedes usar este chequeo
        if (!entity && !scope && !accessMode) {
          return; // No agregar fila si todos los campos son vacíos
        }

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entity}</td>
          <td>${scope}</td>
          <td>${accessMode}</td>
          <td>
            <div class="dropdown">
              <button class="dropbtn">Actions</button>
              <div class="dropdown-content">
                <a href="#" onclick="deletePermiso('${permiso.id}', '${userId}')">Delete</a>
              </div>
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching permisos:", error));
}
function deletePermiso(permisoId, userId) {
  fetch(`/api/auth/permisos/${permisoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadPermisos(userId); // Recargar la lista de usuarios
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function embedSample(id, userId) {
  console.log(userId);
  var boldbiEmbedInstance = BoldBI.create({
    serverUrl: rootUrl + "/" + siteIdentifier,
    dashboardId: id,
    embedContainerId: "dashboard",
    embedType: embedType,
    filterParameters: "Analista a cargo del seguimiento=" + userId,
    environment: environment,
    mode: BoldBI.Mode.View,
    height: "800px",
    width: "1200px",
    authorizationServer: {
      url: authorizationUrl,
    },
    dashboardSettings: {
      showHeader: true,
      showExport: false,
      showRefresh: true,
      enableTheme: true,
      showMoreOption: true,
      enableFilterOverview: true,
      enableFullScreen: true,
      enableAiAssistant: true
    },
    expirationTime: "100000",
  });
  boldbiEmbedInstance.loadDashboard();
}
function openEditUserModal(userId) {
  fetch(`/api/auth/users/${userId}`)
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        const user = users[0]; // Acceder al primer (y único) objeto en el array

        // Verificar y asignar los campos del formulario con los datos del usuario
        const editUserId = document.getElementById("editUserId");
        const editName = document.getElementById("editName");
        const editLastName = document.getElementById("editLastName");
        const editEmail = document.getElementById("editEmail");
        const editUser = document.getElementById("editUser");
        const editStatus = document.getElementById("editStatus");
        const editVerification = document.getElementById("editVerification");
        const editImageUrl = document.getElementById("editImageUrl");
        const editTipoUser = document.getElementById("editTipoUser");

        if (
          editUserId &&
          editName &&
          editLastName &&
          editEmail &&
          editUser &&
          editStatus &&
          editVerification &&
          editImageUrl &&
          editTipoUser
        ) {
          editUserId.value = user.id;
          editName.value = user.name;
          editLastName.value = user.last_name;
          editEmail.value = user.email;
          editUser.value = user.user;
          editStatus.value = user.status;
          editVerification.value = user.verification;
          editImageUrl.value = user.image_url || ""; // Manejar valores nulos
          editTipoUser.value = user.tipo_user;

          // Mostrar el modal de edición
          document.getElementById("editUserModal").style.display = "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}
function openEditUnidadModal(unidadId) {
  fetch(`/api/auth/unidades/${unidadId}`)
    .then((response) => response.json())
    .then((unidades) => {
      if (unidades.length > 0) {
        const unidad = unidades[0]; // Acceder al primer (y único) objeto en el array

        // Verificar y asignar los campos del formulario con los datos del usuario
        const placas = document.getElementById("editU_Placas");
        const estado = document.getElementById("editU_Estado");
        const fechaComp = document.getElementById("editU_FechaDeCompra");
        const cargaMax = document.getElementById("editU_CargaMax");
        const estatus = document.getElementById("editU_Status");
        if (placas && estado && fechaComp && cargaMax && estatus) {
          placas.value = unidad.U_Placas;
          estado.value = unidad.U_Estado;
          fechaComp.value = unidad.U_FechaDeCompra;
          cargaMax.value = unidad.U_CargaMax;
          estatus.value = unidad.U_Status;

          console.log(unidad.U_Status);
          if (unidad.U_Status === "Ocupado") {
            document.getElementById("editU_Status").disabled = true;
          } else {
            document.getElementById("editU_Status").disabled = false; // En caso contrario, habilitarlo
          }
          // Mostrar el modal de edición
          document.getElementById("editUnidadModal").style.display = "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}
function openEditViajeModal(unidadId) {
  fetch(`/api/viaje/viajes/${unidadId}`)
    .then((response) => response.json())
    .then((unidades) => {
      console.log(unidadId);
      if (unidades.length > 0) {
        const unidad = unidades[0]; // Acceder al primer (y único) objeto en el array

        // Verificar y asignar los campos del formulario con los datos del usuario
        const placas = document.getElementById("updateU_Placas");
        const viaje = document.getElementById("upadateV_KeyViaje");
        const operador = document.getElementById("updateV_Operador");
        const estadoOr = document.getElementById("updateV_EstadoOrigen");
        const estadoDe = document.getElementById("updateV_EstadoDestino");
        const fInicio = document.getElementById("updateV_FInicio");
        const fFin = document.getElementById("updateV_FFin");
        const costo = document.getElementById("updateV_Costo");
        const ingreso = document.getElementById("updateV_Ingreso");
        const carga = document.getElementById("updateV_CargaUtilizada");
        const status = document.getElementById("updateV_Status");
        if (
          placas &&
          viaje &&
          operador &&
          estadoOr &&
          estadoDe &&
          fInicio &&
          fFin &&
          costo &&
          ingreso &&
          carga &&
          status
        ) {
          placas.value = unidad.V_Placas;
          viaje.value = unidad.V_KeyViaje;
          operador.value = unidad.V_Operador;
          estadoOr.value = unidad.V_EstadoOrigen;
          estadoDe.value = unidad.V_EstadoDestino;
          fInicio.value = unidad.V_FInicio;
          fFin.value = unidad.V_FFin;
          costo.value = unidad.V_Costo;
          ingreso.value = unidad.V_Ingreso;
          carga.value = unidad.V_CargaUtilizada;
          status.value = unidad.V_Status;
          // Mostrar el modal de edición
          document.getElementById("updateAsignacionViajeModal").style.display =
            "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}
function openEditEstudModal(Student_Id) {
  fetch(`/api/estudiantes/modificar/${Student_Id}`)
    .then((response) => response.json())
    .then((estudiantes) => {
      if (estudiantes.length > 0) {
        const student = estudiantes[0]; // Acceder al primer (y único) objeto en el array
        console.log(student);

        // Verificar y asignar los campos del formulario con los datos del estudiante
        const editStudentId = document.getElementById("editStudentId");
        const editStudentName = document.getElementById("editStudentName");
        const editYear = document.getElementById("editYear");
        const editGender = document.getElementById("editGender");
        const editGradeId = document.getElementById("editGradeId");
        const editFees = document.getElementById("editFees");
        const editDateEnrolment = document.getElementById("editDateEnrolment");
        const editDroppedOut = document.getElementById("editDroppedOut");
        const editStudentSatisfaction = document.getElementById("editStudentSatisfaction");
        const editParentSatisfaction = document.getElementById("editParentSatisfaction");

        if (
          editStudentId &&
          editStudentName &&
          editYear &&
          editGender &&
          editGradeId &&
          editFees &&
          editDateEnrolment &&
          editDroppedOut &&
          editStudentSatisfaction &&
          editParentSatisfaction
        ) {
          editStudentId.value = student.Student_Id || ""; // Manejar valores nulos
          editStudentName.value = student.Student_Name || "";
          editYear.value = student.Year_Id || "";
          editGender.value = student.Gender || "";
          editGradeId.value = student.Grade_Id || "";
          editFees.value = student.Fees || "";
          editDateEnrolment.value = student.Date_Enrolment || "";
          editDroppedOut.value = student.dropped_out || "0"; // Predeterminado a "No"
          editStudentSatisfaction.value = student.student_satisfaction || "";
          editParentSatisfaction.value = student.parent_satisfaction || "";

          // Mostrar el modal de edición
          document.getElementById("editEstudModal").style.display = "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No student data found.");
      }
    })
    .catch((error) => console.error("Error fetching student details:", error));
}

function openEditTaskModal(Task_ID) {
  fetch(`/api/agile/modificar/${Task_ID}`)
    .then((response) => response.json())
    .then((tareas) => {
      if (tareas.length > 0) {
        const tarea = tareas[0]; // Acceder al primer (y único) objeto en el array
        console.log(tarea);

        // Verificar y asignar los campos del formulario con los datos de la tarea
        const editTaskId = document.getElementById("editTaskId");
        const editProjectType = document.getElementById("editProjectType");
        const editTeamMember = document.getElementById("editTeamMember");
        const editTaskStatus = document.getElementById("editTaskStatus");
        const editTaskType = document.getElementById("editTaskType");
        const editStoryPoints = document.getElementById("editStoryPoints");
        const editResourceRole = document.getElementById("editResourceRole");
        const editAssignedDate = document.getElementById("editAssignedDate");
        const editClosedDate = document.getElementById("editClosedDate");
        const editPlannedHours = document.getElementById("editPlannedHours");
        const editWorkedHours = document.getElementById("editWorkedHours");
        const editTaskPriority = document.getElementById("editTaskPriority");
        const editTotalResource = document.getElementById("editTotalResource");
        const editScore = document.getElementById("editScore");

        if (
          editTaskId &&
          editProjectType &&
          editTeamMember &&
          editTaskStatus &&
          editTaskType &&
          editStoryPoints &&
          editResourceRole &&
          editAssignedDate &&
          editClosedDate &&
          editPlannedHours &&
          editWorkedHours &&
          editTaskPriority &&
          editTotalResource &&
          editScore
        ) {
          editTaskId.value = tarea.Task_ID || ""; // Manejar valores nulos
          editProjectType.value = tarea.Proyect_Type || "";
          editTeamMember.value = tarea.Team_Member || "";
          editTaskStatus.value = tarea.Task_Status || "";
          editTaskType.value = tarea.Task_Type || "";
          editStoryPoints.value = tarea.Task_StoryPoints || "";
          editResourceRole.value = tarea.Resource_Role || "";
          editAssignedDate.value = tarea.Assigned_Date || "";
          editClosedDate.value = tarea.Closed_Date || "";
          editPlannedHours.value = tarea.Planned_Hours || "";
          editWorkedHours.value = tarea.Worked_Hours || "";
          editTaskPriority.value = tarea.Task_Priority || "";
          editTotalResource.value = tarea.Total_Resource || "";
          editScore.value = tarea.Score || "";

          // Mostrar el modal de edición
          document.getElementById("editTaskModal").style.display = "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No se encontraron datos de la tarea.");
      }
    })
    .catch((error) => console.error("Error fetching task details:", error));
}


function openAsignarViajeUnidadModal(unidadId) {
  fetch(`/api/auth/unidades/${unidadId}`)
    .then((response) => response.json())
    .then((unidades) => {
      if (unidades.length > 0) {
        const unidad = unidades[0];
        const placas = document.getElementById("addU_Placas");

        if (placas) {
          placas.value = unidad.U_Placas;
          // Mostrar el modal de edición
          document.getElementById("addAsignacionViajeModal").style.display =
            "block";
          loadUnidades();
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}
function eventoUnidad(unidadId) {
  fetch(`/api/auth/unidades/${unidadId}`)
    .then((response) => response.json())
    .then((unidades) => {
      if (unidades.length > 0) {
        const unidad = unidades[0];
        const placas = document.getElementById("E_Placas");

        if (placas) {
          placas.value = unidad.U_Placas;
          // Mostrar el modal de edición
          document.getElementById("eventoModal").style.display = "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}
function openEditTareaModal(tareaId) {
  console.log(tareaId);
  // Realizar una solicitud para obtener los detalles de la tarea específica
  fetch(`/api/tareas/modificar/${tareaId}`)
    .then((response) => response.json())
    .then((tareas) => {
      if (tareas.length > 0) {
        const tarea = tareas[0]; // Acceder al primer (y único) objeto en el array

        // Asignar los valores a los campos del formulario
        document.getElementById("editT_KeyTarea").value = tarea.T_KeyTarea || "";
        document.getElementById("editTitulo").value = tarea.Titulo || "";
        document.getElementById("editDescripcion").value =
          tarea.Descripcion || "";
        document.getElementById("editProyecto").value = tarea.Proyecto || "";
        document.getElementById("editTipo_tarea").value =
          tarea.Tipo_tarea || "";
        document.getElementById("editCategoria").value = tarea.Categoria || "";
        document.getElementById("editAlcance").value = tarea.Alcance || "";
        document.getElementById("editPrioridad").value = tarea.Prioridad || "";
        document.getElementById("editAsignado").value = tarea.Asignado || "";
        document.getElementById("editEstatus").value = tarea.Estatus || "";
        document.getElementById("editPuntos_historia").value =
          tarea.Puntos_historia || "";
        document.getElementById("editFecha_inicio_sprint").value =
          tarea.Fecha_inicio_sprint || "";
        document.getElementById("editKey_Sprint").value =
          tarea.Key_Sprint || "";
        document.getElementById("editFecha_inicio_lib").value =
          tarea.Fecha_inicio_lib || "";
        document.getElementById("editFecha_lib_Sprint").value =
          tarea.Fecha_lib_Sprint || "";
        document.getElementById("editFecha_final_lib").value =
          tarea.Fecha_final_lib || "";
        document.getElementById("editEntregable").value =
          tarea.Entregable || "";
        document.getElementById("editPuntaje_satisfaccion").value =
          tarea.Puntaje_satisfaccion || "";

        // Mostrar el modal de edición
        document.getElementById("editTareaModal").style.display = "block";
      } else {
        console.error("No se encontraron datos de la tarea.");
      }
    })
    .catch((error) =>
      console.error("Error al obtener los detalles de la tarea:", error)
    );
} 
function bloqueoTarea(tareaId) {
  fetch(`/api/tareas/bloqueos/${tareaId}`)
    .then((response) => response.json())
    .then((tareas) => {
      if (tareas.length > 0) {
        const tarea = tareas[0];
        const id_tarea = document.getElementById("T_KeyTarea");

        if (tarea) {
          id_tarea.value = tarea.T_KeyTarea;
          console.log(tarea);
          // Mostrar el modal de edición
          document.getElementById("addRazonModal").style.display = "block";
        } else {
          console.error(
            "Uno o más elementos del formulario no fueron encontrados."
          );
        }
      } else {
        console.error("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}
function showView(viewId) {
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.style.display = "none";
  });
  document.getElementById(viewId).style.display = "block";
}
function loadForms() {
  const userId = localStorage.getItem("user_id"); // Obtener el ID del usuario del almacenamiento local
  const role = localStorage.getItem("userRole");

  if (role != "Administrador") {
    fetch(`/api/perm/permitted-items/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const forms = data.forms;
        const formsMenu = document.getElementById("forms-menu");
        formsMenu.innerHTML = ""; // Limpiar elementos existentes

        forms.forEach((form) => {
          const formItem = document.createElement("li");
          formItem.textContent = form.name;
          formItem.addEventListener("click", () => {
            renderForm(form.id); // Renderizar el formulario cuando se hace clic en él
          });
          formsMenu.appendChild(formItem);
        });
      })
      .catch((error) => console.error("Error fetching forms:", error));
  } else {
    fetch("/api/forms")
      .then((response) => response.json())
      .then((forms) => {
        const formsMenu = document.getElementById("forms-menu");
        formsMenu.innerHTML = ""; // Limpiar elementos existentes

        forms.forEach((form) => {
          const formItem = document.createElement("li");
          formItem.textContent = form.name;
          formItem.addEventListener("click", () => {
            renderForm(form.id); // Renderizar el formulario cuando se hace clic en él
          });
          formsMenu.appendChild(formItem);
        });
      })
      .catch((error) => console.error("Error fetching forms:", error));
  }
}
function loadDashboards() {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("userRole"); // Obtener el ID del usuario del almacenamiento local
  if (role != "Administrador") {
    fetch(`/api/perm/permitted-items/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const dashboards = data.dashboards;
        const dashboardsMenu = document.getElementById("dashboards-menu");
        dashboardsMenu.innerHTML = ""; // Limpiar elementos existentes

        dashboards.forEach((dashboard) => {
          const dashboardItem = document.createElement("li");
          dashboardItem.textContent = dashboard.name_dashboard;
          dashboardItem.addEventListener("click", () => {
            embedSample(dashboard.id, userId); // Renderizar el dashboard cuando se hace clic en él
          });
          dashboardsMenu.appendChild(dashboardItem);
        });
      })
      .catch((error) => console.error("Error fetching dashboards:", error));
  } else {
    fetch("/api/dash/dashboards")
      .then((response) => response.json())
      .then((forms) => {
        const formsMenu = document.getElementById("dashboards-menu");
        formsMenu.innerHTML = "";

        forms.forEach((form) => {
          const formItem = document.createElement("li");
          formItem.textContent = form.name_dashboard;
          formItem.addEventListener("click", () => {
            embedSample(form.id); // Renderizar el formulario cuando se hace clic en él
          });
          formsMenu.appendChild(formItem);
        });
      })
      .catch((error) => console.error("Error fetching forms:", error));
  }
}
function renderForm(formId) {
  fetch(`/api/forms/${formId}`)
    .then((response) => response.json())
    .then((form) => {
      const formularioContainer = document.getElementById("formulario");
      formularioContainer.innerHTML = ""; // Limpiar contenido existente

      const formTitle = document.createElement("h2");
      formTitle.textContent = form.name.replace(/\"/g, ""); // Eliminar comillas dobles
      formularioContainer.appendChild(formTitle);

      const formFields = document.createElement("form");
      formFields.setAttribute("id", "dynamicForm");

      form.config.fields.forEach((field) => {
        console.log(field);
        if (field.name !== "id") {
          const fieldLabel = document.createElement("label");
          fieldLabel.textContent = field.label;

          if (field.type === "select") {
            const selectField = document.createElement("select");
            selectField.setAttribute("name", field.name);
            selectField.setAttribute("id", field.name);

            field.options.forEach((option) => {
              const optionElement = document.createElement("option");
              optionElement.setAttribute("value", option.value);
              optionElement.textContent = option.label;
              selectField.appendChild(optionElement);
            });

            formFields.appendChild(fieldLabel);
            formFields.appendChild(selectField);
            formFields.appendChild(document.createElement("br"));
          } else if (field.type === "textarea") {
            const textareaField = document.createElement("textarea");
            textareaField.setAttribute("name", field.name);
            textareaField.setAttribute("id", field.name);

            formFields.appendChild(fieldLabel);
            formFields.appendChild(textareaField);
          } else if (field.type === "time" || field.type === "hora_decimal") {
            // Asumiendo que en form.config.fields se indica el tipo de campo como "hora_decimal"
            const inputField = document.createElement("input");
            inputField.setAttribute("type", "time");
            inputField.setAttribute("step", "1"); // Precision a 8 decimales
            inputField.setAttribute("name", field.name);
            inputField.setAttribute("id", field.name);

            formFields.appendChild(fieldLabel);
            formFields.appendChild(inputField);
            formFields.appendChild(document.createElement("br"));
          } else {
            const inputField = document.createElement("input");
            console.log(inputField);
            inputField.setAttribute("type", field.type);
            inputField.setAttribute("name", field.name);
            inputField.setAttribute("id", field.name);

            formFields.appendChild(fieldLabel);
            formFields.appendChild(inputField);
            formFields.appendChild(document.createElement("br"));
          }
        }
      });

      const submitButton = document.createElement("button");
      submitButton.textContent = "Enviar";
      submitButton.setAttribute("type", "submit");
      formFields.appendChild(submitButton);

      formularioContainer.appendChild(formFields);

      // Añadir evento de envío con validación
      formFields.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(formFields);
        const data = { formName: form.name.replace(/\"/g, "") }; // Eliminar comillas dobles
        form.config.fields.forEach((field) => {
          if (field.name !== "id") {
            const value = formData.get(field.name);
            data[field.name] =
              field.type === "checkbox" ? value === "on" : value;
          }
        });

        // Seleccionar la función de validación correspondiente
        const validate = validationFunctions[formId];
        if (validate) {
          const { isValid, errors } = validate(data);
          if (isValid) {
            fetch("/api/forms/submit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then((result) => {
                if (result.success) {
                  alert("Datos guardados exitosamente");
                  loadForms();
                } else {
                  alert("Error al guardar los datos: " + result.error);
                }
              })
              .catch((error) => console.error("Error:", error));
          } else {
            alert(
              "Datos inválidos. Por favor, verifica los campos e intenta nuevamente."
            );
            console.log(errors); // Puedes mostrar los errores al usuario si lo deseas
          }
        } else {
          alert(
            "No se encontró la función de validación para el formulario especificado."
          );
        }
      });
    })
    .catch((error) => console.error("Error fetching form details:", error));
}
function loadUsers() {
  fetch("/api/auth/users")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#users-table tbody");
      tbody.innerHTML = "";
      data.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><input type="checkbox" value="${user.id}" class="user-checkbox"></td> <!-- Checkbox -->
                <td>${user.name}</td>
                <td>${user.user}</td>
                <td>${user.email}</td>
                <td>${user.status}</td>
                <td>${user.verification}</td>
                <td>
    <div class="dropdown">
      <button class="dropbtn">Actions</button>
      <div class="dropdown-content">
        <a href="#" onclick="openPermissionsModal('${user.id}')">Manage Permissions</a>
        <a href="#" onclick="openEditUserModal('${user.id}')">Edit</a>
        <a href="#" onclick="deleteUser('${user.id}')">Delete</a>
      </div>
    </div>
  </td>

              `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}
function loadUnidades() {
  fetch("/api/auth/unidades")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#unidades-table tbody");
      tbody.innerHTML = "";
      data.forEach((unidad) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${unidad.U_Placas}</td>
                <td>${unidad.U_Estado}</td>
                <td>${unidad.U_FechaDeCompra}</td>
                <td>${unidad.U_CargaMax}</td>
                <td>${unidad.U_Status}</td>
                <td>
    <div class="dropdown">
      <button class="dropbtn">Actions</button>
      <div class="dropdown-content">
        <a href="#" onclick="eventoUnidad('${
          unidad.U_Placas
        }')">Agregar Evento</a>
        <a href="#" onclick="${
          unidad.U_Status === "Ocupado"
            ? `openEditViajeModal('${unidad.U_Placas}')`
            : `openAsignarViajeUnidadModal('${unidad.U_Placas}')`
        }">Modificar viaje</a>
        <a href="#" onclick="openEditUnidadModal('${
          unidad.U_Placas
        }')">Editar Unidad</a>
        <a href="#" onclick="deleteUnidad('${
          unidad.U_Placas
        }')">Borrar unidad</a>
      </div>
    </div>
  </td>

              `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function loadEstudiantes() {
  fetch("/api/estudiantes/estudiantes")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#estudiantes-table tbody");
      tbody.innerHTML = "";
      data.forEach((estudiante) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${estudiante.Student_Name}</td>
                <td>${estudiante.Academic_Year_Number}</td>
                <td>${estudiante.Grade_Name}</td>
                <td>${estudiante.Date_Enrolment}</td>
                <td>${estudiante.dropped_out}</td>
                <td>
    <div class="dropdown">
      <button class="dropbtn">Actions</button>
      <div class="dropdown-content">
        <a href="#" onclick="openEditEstudModal('${estudiante.Student_Id}')">Editar Estudiante</a>
        <a href="#" onclick="deleteUnidad('${
          estudiante.Student_Id
        }')">Registrar calificación</a>
      </div>
    </div>
  </td>

              `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function loadTareas_Agile() {
  fetch("/api/agile/tareas")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#agile-table tbody");
      tbody.innerHTML = "";
      data.forEach((tarea) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${tarea.Proyect_Type}</td>
                <td>${tarea.Task_Status}</td>
                <td>${tarea.Task_Type}</td>
                <td>${tarea.Task_Priority}</td>
                <td>${tarea.Team_Member}</td>
                <td>${tarea.Assigned_Date}</td>
                <td>${tarea.Planned_Hours}</td>
                <td>
    <div class="dropdown">
      <button class="dropbtn">Actions</button>
      <div class="dropdown-content">
        <a href="#" onclick="openEditTaskModal('${tarea.Task_ID}')">Editar Tarea</a>
      </div>
    </div>
  </td>

              `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function loadTareas() {
  fetch("/api/tareas/tareas")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tbody = document.querySelector("#tareas-table tbody");
      tbody.innerHTML = "";
      data.forEach((tarea) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${tarea.Titulo}</td>
                <td>${tarea.Prioridad}</td>
                <td>${tarea.Asignado}</td>
                <td>${tarea.Estatus}</td>
                <td>
    <div class="dropdown">
      <button class="dropbtn">Actions</button>
      <div class="dropdown-content">
        <a href="#" onclick="FinalizarTarea('${tarea.T_KeyTarea}')">Finalizar tarea</a>
        <a href="#" onclick="bloqueoTarea('${tarea.T_KeyTarea}')">Añadir bloqueos</a>
        <a href="#" onclick="openEditTareaModal('${tarea.T_KeyTarea}')">Modificar tarea</a>
      </div>
    </div>
  </td>

              `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}
function getSelectedUserIds() {
  const checkboxes = document.querySelectorAll(".user-checkbox");
  const selectedUserIds = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedUserIds.push(checkbox.value);
    }
  });
  return selectedUserIds;
}
function loadAccess(selectedEntity) {
  fetch(`/api/perm/permission/access/${selectedEntity}`)
    .then((response) => response.json())
    .then((access) => {
      const accessMenu = document.getElementById("access-menu");
      accessMenu.innerHTML = ""; // Limpiar elementos existentes

      access.forEach((access) => {
        const accessItem = document.createElement("li");
        accessItem.textContent = access.access_mode;
        accessItem.addEventListener("click", () => {
          clearSelection(accessMenu);
          accessItem.classList.add("selected");
          selectedAccess = access.access_mode; // Guardar el id del acceso seleccionado
          console.log("Selected Access:", selectedAccess); // Verificar el id seleccionado
        });
        accessMenu.appendChild(accessItem);
      });
    })
    .catch((error) => console.error("Error fetching access modes:", error));
}
function loadEntities() {
  const category = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  fetch("/api/perm/permission/entities")
    .then((response) => response.json())
    .then((entities) => {
      const filteredEntities = entities.filter(
        (entity) => entity.category === category
      );
      const entitiesMenu = document.getElementById("entities-menu");
      entitiesMenu.innerHTML = ""; // Clear existing elements

      filteredEntities.forEach((entity) => {
        const entityItem = document.createElement("li");
        entityItem.textContent = entity.entity;
        entityItem.addEventListener("click", () => {
          selectedEntity = entity.entity; // Store the selected entity
          if (selectedEntity === "Specific Group") {
            loadGroups();
          } else if (selectedEntity === "Specific Dashboard") {
            loadDashboards_scope();
          } else if (selectedEntity === "Specific Form") {
            loadScope();
          } else if (selectedEntity === "Dashboards in Category") {
            loadCategorias();
          }
          loadAccess(selectedEntity);
          // Remove 'selected' class from all items
          document.querySelectorAll("#entities-menu li").forEach((item) => {
            item.classList.remove("selected");
          });

          // Add 'selected' class to the clicked item
          entityItem.classList.add("selected");
        });
        entitiesMenu.appendChild(entityItem);
      });
    })
    .catch((error) => console.error("Error fetching entities:", error));
}
function loadGroups() {
  fetch("/api/perm/permission/groups")
    .then((response) => response.json())
    .then((groups) => {
      const groupsMenu = document.getElementById("scope-menu");
      groupsMenu.innerHTML = ""; // Clear existing elements

      groups.forEach((group) => {
        const groupItem = document.createElement("li");
        groupItem.textContent = group.name_group;
        groupItem.addEventListener("click", () => {
          selectedScope = group.name_group; // Store the selected entity
          // Remove 'selected' class from all items
          document.querySelectorAll("#scope-menu li").forEach((item) => {
            item.classList.remove("selected");
          });

          // Add 'selected' class to the clicked item
          groupItem.classList.add("selected");
        });
        groupsMenu.appendChild(groupItem);
      });
    })
    .catch((error) => console.error("Error fetching entities:", error));
}
function loadCategorias() {
  fetch("/api/perm/permission/categorias")
    .then((response) => response.json())
    .then((categories) => {
      const categoryMenu = document.getElementById("scope-menu");
      categoryMenu.innerHTML = ""; // Clear existing elements

      categories.forEach((category) => {
        const categoryItem = document.createElement("li");
        categoryItem.textContent = category.name_category;
        categoryItem.addEventListener("click", () => {
          selectedScope = category.name_category; // Store the selected entity
          // Remove 'selected' class from all items
          document.querySelectorAll("#scope-menu li").forEach((item) => {
            item.classList.remove("selected");
          });

          // Add 'selected' class to the clicked item
          categoryItem.classList.add("selected");
        });
        categoryMenu.appendChild(categoryItem);
      });
    })
    .catch((error) => console.error("Error fetching entities:", error));
}
function loadDashboards_scope() {
  // Limpia el contenido del menú para evitar duplicados o datos residuales
  const scopeMenu = document.getElementById("scope-menu");
  scopeMenu.innerHTML = ""; // Limpiar elementos existentes

  // Fetch para obtener los dashboards
  fetch("/api/dash/dashboards")
    .then((response) => response.json())
    .then((dashboards) => {
      dashboards.forEach((dashboardData) => {
        const dashboardItem = document.createElement("li");
        dashboardItem.textContent = "D-" + dashboardData.name_dashboard; // Prefijo "D-" para dashboards
        dashboardItem.addEventListener("click", () => {
          clearSelection(scopeMenu);
          dashboardItem.classList.add("selected");
          selectedScope = dashboardData.name_dashboard; // Guardar el id del dashboard seleccionado
          console.log("Selected Dashboard:", selectedScope); // Verificar el id seleccionado
        });
        scopeMenu.appendChild(dashboardItem);
      });
    })
    .catch((error) => console.error("Error fetching dashboards:", error));
}
function loadScope() {
  // Limpia el contenido del menú para evitar duplicados o datos residuales
  const scopeMenu = document.getElementById("scope-menu");
  scopeMenu.innerHTML = ""; // Limpiar elementos existentes

  // Fetch para obtener los formularios
  fetch("/api/perm/permission/scope")
    .then((response) => response.json())
    .then((scopes) => {
      scopes.forEach((scopeItemData) => {
        const scopeItem = document.createElement("li");
        scopeItem.textContent = "F-" + scopeItemData.name; // Prefijo "F-" para formularios
        scopeItem.addEventListener("click", () => {
          clearSelection(scopeMenu);
          scopeItem.classList.add("selected");
          selectedScope = scopeItemData.name; // Guardar el id del alcance seleccionado
          console.log("Selected Scope:", selectedScope); // Verificar el id seleccionado
        });
        scopeMenu.appendChild(scopeItem);
      });
    })
    .catch((error) => console.error("Error fetching scopes:", error));
}
function validateBitacoraTelcel(data) {
  const errors = {};
  // Helper function to format dates as MM/DD/YYYY
  function formatDate(date) {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    // Create a date object using the provided day, month, and year
    const d = new Date(year, month - 1, day);
    const formattedMonth = String(d.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(d.getDate()).padStart(2, "0");
    const formattedYear = d.getFullYear();
    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  }

  // Convert date fields to MM/DD/YYYY format
  data.fecha_registro = formatDate(data.fecha_registro);
  data.fecha_escalacion = formatDate(data.fecha_escalacion);
  data.fecha_cierre = formatDate(data.fecha_cierre);

  // if (data.hora_cierre.trim() === "") {
  //   data.hora_cierre = "00:00:00";
  // }
  // Validate required fields
  if (!data.fecha_registro) {
    errors.fecha_registro = "Fecha de registro inválida.";
  }
  if (!data.sistema_que_reporta || data.sistema_que_reporta.trim() === "") {
    errors.sistema_que_reporta =
      "El campo 'Sistema que reporta' es obligatorio.";
  }
  if (!data.tipo || data.tipo.trim() === "") {
    errors.tipo = "El campo 'Tipo' es obligatorio.";
  }
  if (
    !data.herramienta_seguimiento ||
    data.herramienta_seguimiento.trim() === ""
  ) {
    errors.herramienta_seguimiento =
      "El campo 'Herramienta de seguimiento' es obligatorio.";
  }
  // Más validaciones específicas...

  console.log(data);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
function validateBitacoraTelcel_v2(data) {
  const errors = {};

  // Helper function to format dates as MM/DD/YYYY
  // function formatDate(date) {
  //   if (!date) return "";
  //   const [year, month, day] = date.split("-");
  //   const d = new Date(year, month - 1, day);
  //   const formattedMonth = String(d.getMonth() + 1).padStart(2, "0");
  //   const formattedDay = String(d.getDate()).padStart(2, "0");
  //   const formattedYear = d.getFullYear();
  //   return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  // }

  // // Convert date fields to MM/DD/YYYY format
  // data["Fecha Registro"] = formatDate(data["Fecha Registro"]);
  // data["Fecha Escalación"] = formatDate(data["Fecha Escalación"]);

  // Validate required fields
  if (!data["Fecha Registro"]) {
    errors["Fecha Registro"] = "Fecha de registro inválida.";
  }
  if (
    !data["Sistema que reporta"] ||
    data["Sistema que reporta"].trim() === ""
  ) {
    errors["Sistema que reporta"] =
      "El campo 'Sistema que reporta' es obligatorio.";
  }
  if (!data["Tipo"] || data["Tipo"].trim() === "") {
    errors["Tipo"] = "El campo 'Tipo' es obligatorio.";
  }
  if (
    !data["Herramienta de Seguimiento"] ||
    data["Herramienta de Seguimiento"].trim() === ""
  ) {
    errors["Herramienta de Seguimiento"] =
      "El campo 'Herramienta de Seguimiento' es obligatorio.";
  }
  // Más validaciones específicas...

  console.log(data);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
function validateCargaHoras(data) {
  const errors = {};
  // Validar el campo Fecha
  if (!data.Fecha || data.Fecha.trim() === "") {
    errors.Fecha = "El campo 'Fecha' es obligatorio.";
  }

  // Validar el campo Recurso
  if (!data.Recurso || data.Recurso.trim() === "") {
    errors.Recurso = "El campo 'Recurso' es obligatorio.";
  }

  // Validar el campo Proyecto
  if (!data.Proyecto || data.Proyecto.trim() === "") {
    errors.Proyecto = "El campo 'Proyecto' es obligatorio.";
  }

  // Validar el campo Horas
  if (!data.Horas || data.Horas.trim() === "") {
    errors.Horas = "El campo 'Horas' es obligatorio.";
  }
  // Más validaciones específicas...

  console.log(data);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
function validaVehiculos(data) {
  const errors = {};

  // Validar el campo Placa
  if (!data.placa || data.placa.trim() === "") {
    errors.placa = "El campo 'Placa' es obligatorio.";
  } else if (data.placa.length > 10) {
    errors.placa = "El campo 'Placa' no puede tener más de 10 caracteres.";
  }

  // Validar el campo Tipo
  const tiposValidos = ["Consulta", "Carga", "Servicio"];
  if (!data.tipo || !tiposValidos.includes(data.tipo)) {
    errors.tipo =
      "El campo 'Tipo' es obligatorio y debe ser una opción válida.";
  }

  // Validar el campo Disponibilidad
  const disponibilidadValida = ["Disponible", "Ocupado"];
  if (
    !data.disponibilidad ||
    !disponibilidadValida.includes(data.disponibilidad)
  ) {
    errors.disponibilidad =
      "El campo 'Disponibilidad' es obligatorio y debe ser una opción válida.";
  }

  // Validar el campo Color
  if (!data.color || data.color.trim() === "") {
    errors.color = "El campo 'Color' es obligatorio.";
  }

  // Validar el campo Km
  if (data.km === undefined || isNaN(data.km) || data.km < 0) {
    errors.km =
      "El campo 'Kilómetros' es obligatorio y debe ser un número mayor o igual a 0.";
  }

  // Validar el campo Marca
  if (!data.marca || data.marca.trim() === "") {
    errors.marca = "El campo 'Marca' es obligatorio.";
  }

  // Validar el campo VIN
  if (data.vin === undefined || isNaN(data.vin) || data.vin < 0) {
    errors.vin =
      "El campo 'VIN' es obligatorio y debe ser un número mayor o igual a 0.";
  }

  // Validar el campo Estado
  if (!data.estado || data.estado.trim() === "") {
    errors.estado = "El campo 'Estado' es obligatorio.";
  }

  // Validar el campo Departamento
  if (!data.departamento || data.departamento.trim() === "") {
    errors.departamento = "El campo 'Departamento' es obligatorio.";
  }

  console.log(data);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
function validaCalendario(data) {
  const errors = {};

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
function validaAsignacion(data) {
  const errors = {};

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validaCoordenadas(data) {
  const errors = {};
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
function validateOtroFormulario(data) {
  const errors = {};
  // Validaciones específicas para otro formulario
  if (!data.campo1 || data.campo1.length < 5) {
    errors.campo1 = "Campo 1 debe tener al menos 5 caracteres.";
  }
  // Más validaciones según sea necesario...
  return { isValid: Object.keys(errors).length === 0, errors };
}
function clearSelection(menu) {
  const items = menu.getElementsByTagName("li");
  for (let item of items) {
    item.classList.remove("selected");
  }
}
function handleRadioChange() {
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  const scopeCard = document.getElementById("scopeCard");
  console.log(selectedCategory, scopeCard);

  if (selectedCategory === "All Settings") {
    scopeCard.classList.add("hidden"); // Hide scope card
  } else {
    scopeCard.classList.remove("hidden"); // Show scope card
  }

  loadEntities(); // Reload entities based on selected category
}
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = decodeURIComponent(
    atob(base64Url)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(base64);
}
function showMenuBasedOnRole() {
  const token = localStorage.getItem("authToken");
  if (token) {
    const decodedToken = parseJwt(token);
    const userRole = localStorage.getItem("userRole");
    console.log(userRole);
    // const userId = decodedToken.userId;

    // Opciones de menú para cada rol
    const menuOptions = {
      Visualizador: ["#menu-dashboard", "#signOut"],
      Administrador: [
        "#menu-dashboard",
        "#menu-upload",
        "#menu-users",
        "#menu-unidades",
        "#menu-tareas",
        "#menu-team-agile",
        "#menu-estudiantes",
        "#signOut",
      ],
      "Visualizador y carga": ["#menu-dashboard", "#menu-upload", "#signOut"],
      "Solo carga": ["#menu-upload", "#signOut"],
      ACP: ["#menu-tareas", "#menu-dashboard", "#signOut"],
      "ACP-Desarrollo": ["#menu-tareas", "#menu-dashboard", "#signOut"],
    };

    // Limpiar el menú actual
    const menuLinks = document.querySelectorAll(".sidebar a");
    menuLinks.forEach((link) => (link.style.display = "none"));

    // Mostrar opciones de menú
    if (menuOptions[userRole]) {
      menuOptions[userRole].forEach((selector) => {
        const menuItem = document.querySelector(selector);
        if (menuItem) {
          menuItem.style.display = "block";
        }
      });
    } else {
      // Opciones predeterminadas si el rol no está definido
      console.log("No menu options available for this role");
    }

    const addFormButton = document.getElementById("addFormButton");
    if (userRole === "Visualizador y carga") {
      if (addFormButton) {
        addFormButton.style.display = "none";
      }
    }
  } else {
    console.log("No authentication token found.");
  }
  // Llamar a la función para mostrar el menú al cargar la página

  // Funcionalidad del botón de retroceso
  // document.getElementById("backButton").addEventListener("click", () => {
  //   window.history.back();
  // });
}
function addCostoRow() {
  const tableBody = document.getElementById("costoTableBody");

  // Crear una nueva fila
  const newRow = document.createElement("tr");

  // Añadir las celdas con los campos necesarios
  newRow.innerHTML = `
    <td>
      <select name="C_Categoria[]" required>
        <option value="Gasolina">Gasolina</option>
        <option value="Limpieza">Limpieza</option>
        <option value="Llantas">Llantas</option>
        <option value="Mensualidad">Mensualidad</option>
      </select>
    </td>
    <td>
      <select name="C_Tipo[]" required>
        <option value="Cambio de Llantas">Cambio de Llantas</option>
        <option value="Lavado Completo">Lavado Completo</option>
        <option value="Lavado Exterior">Lavado Exterior</option>
        <option value="Limpieza Interior">Limpieza Interior</option>
        <option value="Limpieza Interior y Exterior">Limpieza Interior y Exterior</option>
        <option value="Pago de Arrendamiento">Pago de Arrendamiento</option>
        <option value="Recarga Completa">Recarga Completa</option>
        <option value="Revision de Llantas">Revision de Llantas</option>
        <option value="Revision de Presión">Revision de Presión</option>
      </select>
    </td>
    <td>
      <input type="number" name="C_Monto[]" step="0.01" required />
    </td>
    <td>
      <button type="button" onclick="removeCostoRow(this)">Eliminar</button>
    </td>
  `;

  // Añadir la nueva fila al cuerpo de la tabla
  tableBody.appendChild(newRow);
}
function removeCostoRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
}
