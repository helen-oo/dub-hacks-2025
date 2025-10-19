// generate recipe suggestions based on items
const recipeApiKey = 'b4d6c0654ac841daae6f8d00ad6010aa';
const recipeApi = 'https://api.spoonacular.com/recipes/complexSearch';
const mainContent = document.getElementById('main-content');

// Function to get items from local storage
function getItems() {
    return "chicken"; // Placeholder for actual items
}

// Authenticate API Key
const params = {
    method: 'GET',
    headers: {
        'X-Api-Key': recipeApiKey,
    }
};

// Function to fetch recipes based on items
async function fetchRecipes() {
    try {
        const response = await fetch(`${recipeApi}?includeIngredients=${getItems()}&number=5&addRecipeInformation=true`, params);
        console.log(response);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        mainContent.innerHTML = "<p>Could not fetch recipes. Please try again later.</p>";
    }
}

// Function to display recipes in the main content area
async function displayRecipes() {
    const data = await fetchRecipes();

    if (data && data.results) {
        mainContent.innerHTML = '';         // Clear existing content

        // Add a heading
        const heading = document.createElement('h2');
        heading.textContent = 'Recipes you can make:';
        mainContent.appendChild(heading);

        // Create a row for the recipe cards
        const row = document.createElement('div');
        row.className = 'row justify-content-center';

        // Loop through recipes
        data.results.forEach(recipe => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6 my-3';

            // Create card
            const card = document.createElement('div');
            card.className = 'card';

            // Recipe image
            const img = document.createElement('img');
            img.src = recipe.image;
            img.alt = recipe.title;
            img.className = 'card-img-top';

            // Card body
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // Recipe title
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = recipe.title;

            // Link to recipe
            const link = document.createElement('a');
            link.href = recipe.sourceUrl;
            link.target = '_blank';
            link.className = 'btn btn-primary';
            link.textContent = 'View Recipe';

            // Append elements
            cardBody.appendChild(title);
            cardBody.appendChild(link);
            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
        });

        mainContent.appendChild(row);
    } else {
        mainContent.innerHTML = '<p>No recipes found for your ingredients.</p>';
    }
}

// displayRecipes();


// everything in this js file has been made only for the camera
// Get elements
const openCameraBtn = document.getElementById('take-photo');
const openGalleryBtn = document.getElementById('open-photo-library');
const galleryInput = document.getElementById('gallery-input');
const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
const cameraPreview = document.getElementById('camera-preview');
const captureBtn = document.getElementById('capture-btn');

let cameraStream = null;

// Open camera
openCameraBtn.addEventListener('click', async function() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 } 
        });
        cameraPreview.srcObject = cameraStream;
        cameraModal.show();
    } catch (error) {
        alert('Cannot access camera: ' + error.message);
    }
});

// Capture photo
captureBtn.addEventListener('click', function() {
    const canvas = document.createElement('canvas');
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    canvas.getContext('2d').drawImage(cameraPreview, 0, 0);
    
    const imageData = canvas.toDataURL('image/png');
    processImage(imageData);
    cameraModal.hide();
    stopCamera();
});

// Open gallery
openGalleryBtn.addEventListener('click', function() {
    galleryInput.click();
});

// Handle gallery selection
galleryInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Stop camera
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
}

// Process the image (your custom logic here)
function processImage(imageData) {
    console.log('Image ready:', imageData);
    alert('Image captured/selected!');
    // Add your image processing here
}

// Clean up when modal closes
document.getElementById('cameraModal').addEventListener('hidden.bs.modal', stopCamera);




// Filter button functionality
const filterIcon = document.getElementById('filter-icon');
const filterMenu = document.getElementById('filter-menu');

filterIcon.addEventListener('click', () => {
  filterMenu.style.display = (filterMenu.style.display === 'none' || filterMenu.style.display === '') 
    ? 'block' 
    : 'none';
  });

  // Optional: Click outside to close filter menu
  document.addEventListener('click', function(event) {
    if (!filterMenu.contains(event.target) && !filterIcon.contains(event.target)) {
      filterMenu.style.display = 'none';
    }
});

// Show on hover
filterIcon.addEventListener('mouseenter', () => {
  filterMenu.style.display = 'block';
});

filterIcon.addEventListener('mouseleave', () => {
  // Only hide if the mouse isn't over the filter dropdown
  setTimeout(() => {
    if (!filterMenu.matches(':hover')) {
      filterMenu.style.display = 'none';
    }
  }, 300);
});

// Keep showing while hovering over filter menu
filterMenu.addEventListener('mouseleave', () => {
  filterMenu.style.display = 'none';
});

// Helper icon for more info 
const helpIcon = document.getElementById('help-icon');
const helpInfo = document.getElementById('help-info');

// Toggle help info on click
helpIcon.addEventListener('click', () => {
  helpInfo.style.display = (helpInfo.style.display === 'none' || helpInfo.style.display === '') 
    ? 'block' 
    : 'none';
});

// Show on hover
helpIcon.addEventListener('mouseenter', () => {
  helpInfo.style.display = 'block';
});

helpIcon.addEventListener('mouseleave', () => {
  // Only hide if the mouse isn't over the info box
  setTimeout(() => {
    if (!helpInfo.matches(':hover')) {
      helpInfo.style.display = 'none';
    }
  }, 300);
});

// Keep showing while hovering over help-info
helpInfo.addEventListener('mouseleave', () => {
  helpInfo.style.display = 'none';
});

// Image functionality

// import {
//   GoogleGenAI,
//   createUserContent,
//   createPartFromUri,
// } from "@google/genai";

// const ai = new GoogleGenAI({});

// async function main() {
//   const myfile = await ai.files.upload({
//     file: "path/to/sample.jpg",
//     config: { mimeType: "image/jpeg" },
//   });

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: createUserContent([
//       createPartFromUri(myfile.uri, myfile.mimeType),
//       "Caption this image.",
//     ]),
//   });
//   console.log(response.text);
// }

// await main();
