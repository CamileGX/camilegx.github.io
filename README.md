# DexieOS

Osobiste centrum projektów, notatek i codziennych informacji dla Kamila.

## Funkcje

- dashboard z czasem i datą dla `Europe/London`,
- aktualna pogoda dla Southampton przez Open-Meteo,
- dodawanie, edycja i usuwanie projektów,
- notatki z autosave i kategoriami,
- timeline,
- baza wiedzy,
- changelog,
- globalna wyszukiwarka,
- motyw jasny/ciemny i wybór koloru akcentu,
- eksport i import wszystkich danych do JSON,
- przechowywanie danych w `localStorage`,
- pełna zgodność z GitHub Pages.

## Struktura

```text
index.html
css/
  styles.css
js/
  app.js
README.md
```

## Uruchomienie lokalne

Nie otwieraj projektu przez `file://`, ponieważ JavaScript korzysta z modułów.

W folderze projektu uruchom jeden z serwerów:

```bash
python -m http.server 8000
```

Następnie otwórz:

```text
http://localhost:8000
```

Możesz też użyć rozszerzenia Live Server w VS Code.

## Publikacja na GitHub Pages

Repozytorium użytkownika `CamileGX/camilegx.github.io` powinno publikować stronę bez dodatkowej konfiguracji z gałęzi `main`.

Wszystkie ścieżki są względne:

```html
./css/styles.css
./js/app.js
```

Dzięki temu projekt działa zarówno lokalnie przez serwer HTTP, jak i na GitHub Pages.

## Pogoda

Pogoda jest pobierana z publicznego API Open-Meteo dla współrzędnych Southampton. Nie jest wymagany klucz API. Ostatnia poprawna odpowiedź jest zapisywana w pamięci przeglądarki jako fallback.

## Dane użytkownika

Dane projektów, notatek i ustawień pozostają lokalnie w przeglądarce. Używaj regularnie przycisku **Eksport danych**, aby utworzyć kopię zapasową JSON.
