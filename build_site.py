# Generates index.html for Speedgate Logistics
from pathlib import Path

BODY = Path(__file__).read_text(encoding="utf-8").split("---BODY---")[1].split("---END---")[0]
HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Speedgate Logistics | Import Your Dream Car to Kenya</title>
  <meta name="description" content="Speedgate Logistics — import cars from Japan, UK, Thailand and more to Kenya." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="css/speedgate.css" />
</head>
"""

SCRIPT = """
<script src="js/supabase-config.js"></script>
<script src="js/supabase-db.js"></script>
<script src="js/site.js"></script>
</body>
</html>
"""

Path("index.html").write_text(HEAD + BODY + SCRIPT, encoding="utf-8")
print("Wrote index.html")

---BODY---
<body>

---END---
