const unsplashIds = [
  "photo-1523381210434-271e8be1f52b",
  "photo-1483985988355-763728e1935b",
  "photo-1541099649105-f69ad21f3246",
  "photo-1521572267360-ee0c2909d518",
  "photo-1562157873-818bc0726f68",
  "photo-1556911220-e15b29be8c8f",
  "photo-1620799140408-edc6dcb6d633",
  "photo-1576995853123-5a10305d93c0",
  "photo-1548883354-7622d03aca27",
  "photo-1624378439575-d8705ad7ae80",
  "photo-1551854838-212c50b4c184",
  "photo-1591195853828-11db59a44f6b",
  "photo-1539185441755-769473a23570",
  "photo-1588850561407-ed78c282e89b",
  "photo-1618354691373-d851c5c3a990",
  "photo-1544816155-12df9643f363",
  "photo-1553062407-98eeb64c6a62",
  "photo-1582966772680-860e372bb558",
  "photo-1584622650111-993a426fbf0a",
];

async function checkImages() {
  console.log("Checking Unsplash image availability...");
  let allOk = true;

  for (const id of unsplashIds) {
    const url = `https://images.unsplash.com/${id}?w=800&q=80`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (res.status === 200) {
        console.log(`✅ ${id}: OK (200)`);
      } else {
        const bodyText = await res.text().catch(() => "");
        console.log(
          `❌ ${id}: FAILED with status ${res.status}. Body: ${bodyText.slice(0, 100)}`
        );
        allOk = false;
      }
    } catch (err) {
      console.log(
        `❌ ${id}: FAILED with error ${err instanceof Error ? err.message : String(err)}`
      );
      allOk = false;
    }
  }

  if (allOk) {
    console.log(
      "\n🎉 All 16 Unsplash image IDs are active and 100% free from 404 errors!"
    );
  } else {
    console.log(
      "\n⚠️ Some images failed validation. Please replace the failed photo IDs."
    );
  }
}

checkImages();
