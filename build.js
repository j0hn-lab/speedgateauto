const fs = require('fs');
const path = require('path');
const HERO = 'carbackground.png';

let body = fs.readFileSync(path.join(__dirname, 'build_fragment.html'), 'utf8');
body = body.replace(/<\/?motion\b/g, (m) => m.replace('motion', 'div'));
body = body.replace('__HERO__', HERO);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Speedgate Logistics | Import Your Dream Car to Kenya</title>
  <meta name="description" content="Speedgate Logistics — import cars from Japan, UK, Thailand and more to Kenya." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="css/speedgate.css" />
</head>
<body>
${body}
<script src="js/supabase-config.js"></script>
<script src="js/supabase-db.js"></script>
<script src="js/site.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Wrote index.html');
