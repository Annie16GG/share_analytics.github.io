document.getElementById("signOut").addEventListener("click", (event) => {
  event.preventDefault();

  // Eliminar token de autenticación de localStorage
  localStorage.removeItem("authToken");

  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = "../index.html";
});
var siteIdentifier = "site/capacitacion";
var environment = "onpremise";
var embedType = "component";
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
var dashboardId = "dee9aba7-1484-4ab3-8114-066614d7ca01";
var rootUrl = "https://login.shareanalytics.com.mx/bi";
const authorizationUrl = "https://share-analytics.vercel.app/embeddetail/get";
let selectedAccess = null;
let selectedEntity = null;
let selectedScope = null;
const addUserModal = document.getElementById("addUserModal");
const addUserButton = document.getElementById("addUserButton");
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

const validationFunctions = {
  25: validateBitacoraTelcel,
  27: validateBitacoraTelcel_v2,
  otro_formulario: validateOtroFormulario,
  // Agrega más formularios y funciones aquí...
};

// Mostrar el modal cuando se haga clic en el botón "Add User"
addUserButton.onclick = function () {
  addUserModal.style.display = "block";
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
// Cerrar el modal cuando se haga clic en el botón de cierre
closeModal.onclick = function () {
  addUserModal.style.display = "none";
  addFormModal.style.display = "none";
  selectGroupModal.style.display = "none";
};
// Cerrar el modal cuando se haga clic fuera del contenido del modal
window.onclick = function (event) {
  if (event.target == addUserModal) {
    addUserModal.style.display = "none";
  }
};
// btn.onclick = function () {
//   modal.style.display = "block";
// };
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
// Cerrar el modal si se hace clic fuera de su contenido
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
// Función para añadir un nuevo campo
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

const addCategoryModal = document.getElementById("addCategoryModal");
const addCategoryButton = document.getElementById("CategoryButton");

document
  .getElementById("CategoryButton")
  .addEventListener("click", function () {
    addCategoryModal.style.display = "block";
  });

// Obtener referencias a los elementos del modal
const selectGroupModal = document.getElementById("selectGroupModal");
const closeModalButton = selectGroupModal.querySelector(".close");
const tabButtons = selectGroupModal.querySelectorAll(".tab-button");
const tabContents = selectGroupModal.querySelectorAll(".tab-content");
const addGroupButton = document.getElementById("addGroupButton");
const existingGroupSelect = document.getElementById("existingGroupSelect");

// Abrir modal cuando se hace clic en el botón de acción
document
  .getElementById("selectedActionButton")
  .addEventListener("click", function () {
    selectGroupModal.style.display = "block";
    loadExistingGroups();
  });

// Cambiar entre pestañas
tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    const targetTab = button.getAttribute("data-tab");
    document.getElementById(targetTab).classList.add("active");
  });
});

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

// Enviar datos al backend al añadir grupo
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

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", function (event) {
  if (event.target === selectGroupModal) {
    selectGroupModal.style.display = "none";
  }
});

// Cerrar modal al hacer clic en el botón de cerrar
closeModalButton.addEventListener("click", function () {
  selectGroupModal.style.display = "none";
});

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
// Función para manejar el envío del formulario de edición
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
  console.log(updatedUser);

  fetch(`/api/auth/users/${editUserId}`, {
    method: "PUT", // Método HTTP para actualizar datos
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User updated successfully:", data);
      // Cerrar el modal
      document.getElementById("editUserModal").style.display = "none";
      loadUsers(); // Opcional: refrescar la lista de usuarios o actualizar la UI según sea necesario
    })
    .catch((error) => console.error("Error updating user details:", error));
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
    dashboardSettings: { showHeader: true, showExport: false, showRefresh: true, enableTheme: true, showMoreOption: true, enableFilterOverview: true, enableFullScreen: true, },
    expirationTime: "100000",
  });
  console.log(boldbiEmbedInstance);
  // console.log(boldbiEmbedInstance.serverUrl);
  console.log(authorizationUrl);
  if ((boldbiEmbedInstance.IsDependencyLoaded = true)) {
    boldbiEmbedInstance.loadDashboard();
  } else {
    const dashboardDiv = document.getElementById("dashboard");
    dashboardDiv.innerHTML =
      "<p>No se puede acceder al dashboard. Por favor, intente de nuevo más tarde.</p>";
  }
}
// Función para mostrar la vista seleccionada
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
function showView(viewId) {
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.style.display = "none";
  });
  document.getElementById(viewId).style.display = "block";
}
// Cargar formularios permitidos para el usuario actual
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
// Cargar dashboards permitidos para el usuario actual
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
// Función para renderizar el formulario seleccionado
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
  if (!data["Sistema que reporta"] || data["Sistema que reporta"].trim() === "") {
    errors["Sistema que reporta"] = "El campo 'Sistema que reporta' es obligatorio.";
  }
  if (!data["Tipo"] || data["Tipo"].trim() === "") {
    errors["Tipo"] = "El campo 'Tipo' es obligatorio.";
  }
  if (!data["Herramienta de Seguimiento"] || data["Herramienta de Seguimiento"].trim() === "") {
    errors["Herramienta de Seguimiento"] = "El campo 'Herramienta de Seguimiento' es obligatorio.";
  }
  // Más validaciones específicas...

  console.log(data);
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
        "#signOut",
      ],
      "Visualizador y carga": ["#menu-dashboard", "#menu-upload", "#signOut"],
      "Solo carga": ["#menu-upload", "#signOut"],
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

addCategoryButton.addEventListener("click", function () {
  let groupData;

    const categoryName = document.getElementById("categoryName").value;
    const categoryDescription = document.getElementById("categoryDescription").value;
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
// Enviar los datos seleccionados al servidor cuando se envíe el formulario
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

// Event listener para el formulario de edición
document
  .getElementById("editUserForm")
  .addEventListener("submit", submitEditUserForm);
// Manejar el envío del formulario para añadir un nuevo formulario
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
// Eventos para el menú
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
