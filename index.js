const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const app = express()
const port = 3000


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'public' ,'views','pages'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static("public"))

// Importation des modules nécessaires


// Configuration de Multer pour gérer les fichiers uploadés
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// ...

// Configuration de la session
app.use(session({
  secret: 'votreSecretSession',
  resave: true,
  saveUninitialized: true
}));

// Middleware pour gérer les routes
app.get('/', (req, res) => {
  res.render("inscription");
});

app.post('/submit', upload.single('avatar'), (req, res) => {
  // Récupération des données du formulaire
  const { firstname, lastname, email } = req.body;

  // Récupération du chemin de l'image uploadée
  const imagePath = req.file ? req.file.path : null;

  // Création d'un nouvel objet avec les données du formulaire
  const newFormData = { firstname, lastname, email, imagePath };

  // Initialisation de la liste dans la session si elle n'existe pas encore
  req.session.formDataList = req.session.formDataList || [];

  // Ajout du nouvel objet à la liste
  req.session.formDataList.push(newFormData);

  // Redirection vers une page de confirmation ou une autre page
  res.redirect('liste');
});

app.get('/liste', (req, res) => {
  // Récupération de la liste des données de la session
  const formDataList = req.session.formDataList || [];
  res.render('liste', { formDataList });
});

// ... (votre code existant)

// Ajoutez une nouvelle route pour gérer la suppression
app.get('/delete/:index', (req, res) => {
  const { index } = req.params;

  // Vérifiez que l'index est valide et existe dans la liste
  if (req.session.formDataList[index]) {
    // Supprimez l'élément correspondant à l'index de la liste
      req.session.formDataList.splice(index, 1);

    // Mettez à jour la liste dans la session
  }

  // Redirigez vers la page de liste après la suppression
  res.redirect('/liste');
});

app.get('/edit/:index', (req, res) => {
  const { index } = req.params;
  console.log(req.body)
  // Vérifiez que l'index est valide et existe dans la liste
  if (req.session.formDataList && req.session.formDataList[index]) {
    // Récupérez les données de l'inscription à modifier
    const formDataToEdit = req.session.formDataList[index];

    // Affichez le formulaire de modification avec les données actuelles
    res.render('edit', { formDataToEdit, index });
  } else {
    // Redirigez vers la page de liste si l'index est invalide
    res.redirect('/liste');
  }
});
app.post('/update/:index', (req, res) => {
  const { index } = req.params;

  // Vérifiez que l'index est valide et existe dans la liste
  if (req.session.formDataList && req.session.formDataList[index]) {
    // Mettez à jour les données de l'inscription
    req.session.formDataList[index].firstname = req.body.editFirstname;
    req.session.formDataList[index].lastname = req.body.editLastname;
    req.session.formDataList[index].email = req.body.editEmail;

    // Redirigez vers la page de liste après la modification
    res.redirect('/liste');
  } else {
    // Redirigez vers la page de liste si l'index est invalide
    res.redirect('/liste');
  }
});




// ... (votre code existant)

// ...


/*
app.get('/', (req, res) => {
  res.render(path.join(__dirname,'public/views/pages/login.ejs'))
  //res.sendFile(path.join(__dirname,'public/views/pages/login.ejs'))
})

app.get('/login', (req, res) => {
  res.render(path.join(__dirname,'public/views/pages/login.ejs'))
  //res.sendFile(path.join(__dirname,'public/views/pages/login.ejs'))
})

app.get('/inscription', (req, res) => {
  res.render(path.join(__dirname,'public/views/pages/inscription.ejs'))
  //res.sendFile(path.join(__dirname,'public/views/pages/login.ejs'))
})

app.get('/liste', (req, res) => {
  res.render(path.join(__dirname,'public/views/pages/liste.ejs'))
  //res.sendFile(path.join(__dirname,'public/views/pages/login.ejs'))
})
app.post('/' , (req , res)=>{
   res.send('hello from simple server :)')

})

*/
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})