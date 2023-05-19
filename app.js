document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); 

  // Obtener el archivo cargado
  var file = document.getElementById("fileInput").files[0];

  // Crear un lector de archivos
  var reader = new FileReader();

  reader.onload = function (e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, { type: "binary" });
    var sheet_name_list = workbook.SheetNames;
    var worksheet = workbook.Sheets[sheet_name_list[0]];

    // Obtener los datos del archivo Excel y guardarlos en un array
    var data = XLSX.utils.sheet_to_json(worksheet);

    data.forEach(function (row) {
      //       console.log(row.numero + ", " + row.nombre);

    let datos = {
        messaging_product: "whatsapp",
        preview_url: false,
        recipient_type: "individual",
        to: row.numero,
        type: "template",
        template: {
          name: "bienvenida",
          language: {
            code: "es",
            policy: "deterministic",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: row.nombre,
                },
              ],
            },
          ],
        },
      };

      fetch("https://graph.facebook.com/v16.0/{{ID_NUMBER}}/messages", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer {{TOKEN_API}}",
          "WABA-ID": "{{ID_WHATSAPP}}",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  // Leer el archivo cargado como datos binarios
  reader.readAsBinaryString(file);
});
