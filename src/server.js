const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const recipes = [
  {
    id: "classic_lasagna",
    name: "Classic Lasagna Bolognese",
    origin: "🇮🇹 Italian",
    description: "Layers of slow-cooked ragù, creamy béchamel, and parmesan.",
    prep: "30 min",
    cook: "1h 20min",
    difficulty: "Medium",
    image: "https://images.pexels.com/photos/6046492/pexels-photo-6046492.jpeg?auto=compress&cs=tinysrgb&w=600",
    ingredients: [
      { item: "Lasagna sheets", amount: "12 sheets" },
      { item: "Ground beef & pork", amount: "400g + 200g" },
      { item: "Tomato passata", amount: "700g" },
      { item: "Parmigiano Reggiano", amount: "120g" }
    ],
    steps: [
      "Sauté soffritto until soft, add meat and brown.",
      "Make béchamel: melt butter, add flour, whisk in milk.",
      "Layer pasta, ragù, béchamel, and parmesan.",
      "Bake at 190°C for 40 minutes.",
      "Rest 10 minutes before serving."
    ]
  },
  {
    id: "spaghetti_carbonara",
    name: "Spaghetti Carbonara",
    origin: "🇮🇹 Italian",
    description: "Silky egg & pecorino sauce with crispy guanciale.",
    prep: "10 min",
    cook: "15 min",
    difficulty: "Easy",
    image: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=600",
    ingredients: [
      { item: "Spaghetti", amount: "400g" },
      { item: "Guanciale", amount: "150g" },
      { item: "Egg yolks", amount: "4" },
      { item: "Pecorino Romano", amount: "100g" }
    ],
    steps: [
      "Cook spaghetti al dente. Reserve pasta water.",
      "Render guanciale until crisp.",
      "Whisk egg yolks and pecorino.",
      "Combine pasta with egg mixture, add pasta water.",
      "Serve immediately with black pepper."
    ]
  },
  {
    id: "new_york_cheesecake",
    name: "New York Cheesecake",
    origin: "🇺🇸 American",
    description: "Ultra-creamy cheesecake with graham crust.",
    prep: "25 min",
    cook: "1 hour",
    difficulty: "Medium",
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600",
    ingredients: [
      { item: "Graham cracker crumbs", amount: "2 cups" },
      { item: "Cream cheese", amount: "900g" },
      { item: "Sugar", amount: "1.5 cups" },
      { item: "Eggs", amount: "4" }
    ],
    steps: [
      "Mix crumbs with butter, press into pan.",
      "Beat cream cheese, add sugar, then eggs.",
      "Pour filling over crust. Use water bath.",
      "Bake at 160°C for 65 minutes.",
      "Chill 6+ hours before serving."
    ]
  }
];

app.get('/api/recipes', (req, res) => {
  res.json({ success: true, data: recipes });
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  recipe ? res.json({ success: true, data: recipe }) : res.status(404).json({ success: false });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Recipe App running on port ${PORT}`);
});
