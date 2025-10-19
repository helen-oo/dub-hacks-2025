// generate recipe suggestions based on items
const recipeApiKey = 'dbc6a062ad6344f883add4dde39057f5';
const recipeApi = 'https://api.spoonacular.com/recipes/complexSearch';
const mainContent = document.getElementById('main-content');

// Store all recipes before filtering
let allRecipes = [];
let currentRecipes = [];

// Get items from user input
function getItems() {
    const input = document.getElementById('ingredient-input');
    return input.value.trim();
}

// Add event listener for the button
document.getElementById('generate-recipes-btn').addEventListener('click', () => {
    displayRecipes();
});

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
        const response = await fetch(`${recipeApi}?includeIngredients=${getItems()}&number=9&addRecipeInformation=true`, params);
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
        // Store all recipes and set current recipes to all recipes initially
        allRecipes = data.results;
        currentRecipes = [...allRecipes];
        
        showRecipes();
    } else {
        mainContent.innerHTML = '<p>No recipes found for your ingredients.</p>';
    }
}

// Function to show recipes from the current array
function showRecipes() {
    mainContent.innerHTML = '';         // Clear existing content

    if (currentRecipes.length === 0) {
        mainContent.innerHTML = '<p>No recipes match your filters.</p>';
        return;
    }
    
    // Add a heading
    const heading = document.createElement('h2');
    heading.textContent = 'Recipes you can make:';
    mainContent.appendChild(heading);

    // Create a row for the recipe cards
    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    // Loop through recipes
    currentRecipes.forEach(recipe => {
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

        // Recipe diets (if available)
        if (recipe.diets && recipe.diets.length > 0) {
            const diets = document.createElement('p');
            diets.className = 'card-text text-muted small';
            diets.textContent = `Diets: ${recipe.diets.join(', ')}`;
            cardBody.appendChild(diets);
        }

        // Link to recipe
        const link = document.createElement('a');
        link.href = recipe.sourceUrl;
        link.target = '_blank';
        link.className = 'btn btn-primary mt-2';
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
}

// Filter functionality
function applyFilters() {
    const selectedFilters = getSelectedFilters();
    
    if (selectedFilters.length === 0) {
        // If no filters selected, show all recipes
        currentRecipes = [...allRecipes];
    } else {
        // Filter recipes based on selected dietary restrictions
        currentRecipes = allRecipes.filter(recipe => {
            // Check if recipe matches ALL selected filters
            return selectedFilters.every(filter => {
                return matchFilter(recipe, filter);
            });
        });
    }
    
    showRecipes();
}

const filterBox = document.querySelectorAll('.filter-checkbox');

// Get all selected filter values
function getSelectedFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    console.log(checkboxes);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Check if a recipe matches a specific filter
function matchFilter(recipe, filter) {
    const recipeDiets = recipe.diets || [];
    const recipeTitle = recipe.title.toLowerCase();
    const recipeSummary = recipe.summary ? recipe.summary.toLowerCase() : '';
    
    // Helper functions for common checks
    const hasDiet = (dietName) => recipeDiets.some(diet => diet.toLowerCase().includes(dietName));
    const excludesIngredient = (ingredient) => !recipeTitle.includes(ingredient) && !recipeSummary.includes(ingredient);
    const hasFlag = (flagName) => recipe[flagName] === true;
    
    if (filter === 'dairyFree') 
        return hasFlag('dairyFree') || hasDiet('dairy');
    
    if (filter === 'glutenFree') 
        return hasFlag('glutenFree') || hasDiet('gluten');
    
    if (filter === 'vegan') 
        return hasFlag('vegan') || hasDiet('vegan');
    
    if (filter === 'vegeterian') 
        return hasFlag('vegetarian') || hasDiet('vegetarian');
    
    if (filter === 'lowCard') 
        return recipeTitle.includes('low carb') || recipeSummary.includes('low carb') || hasDiet('low carb');
    
    if (filter === 'nutFree') 
        return excludesIngredient('nut') && hasDiet('nut free');
    
    if (filter === 'diabeticFriendly') 
        return recipeTitle.includes('diabetic') || recipeSummary.includes('diabetic') || hasDiet('diabetic');
    
    if (filter === 'eggFree') 
        return excludesIngredient('egg') && hasDiet('egg free');
    
    if (filter === 'halal') 
        return hasDiet('halal');
    
    if (filter === 'plantbased') 
        return hasDiet('plant') || recipeTitle.includes('plant based') || recipeSummary.includes('plant based');
    
    if (filter === 'pescatarian') 
        return hasDiet('pescatarian');
    
    if (filter === 'soyFree') 
        return excludesIngredient('soy') && hasDiet('soy free');
    
    // Default: check if the diet name appears in recipe diets
    return hasDiet(filter);
}


// Add event listeners to filter checkboxes
filterBox.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});


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

// // Image functionality

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


