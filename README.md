# Portion Planner PWA

Progressive Web App для iPhone и Windows 11.

## Функции

- English по умолчанию;
- переключение на Nederlands;
- расчет порций по рабочему времени;
- учет перерывов;
- продолжение порции после перерыва;
- расчет неполной последней порции;
- пропорциональный расчет жира, воды, сахара и муки;
- сохранение введенных данных в браузере;
- PWA manifest и service worker для добавления на главный экран iPhone.

## Как открыть на Windows 11

Самый простой локальный запуск:

```powershell
cd C:\Users\pc\Documents\Codex\2026-06-12\iphone\outputs\BakeryPWA
python -m http.server 8080
```

Затем откройте:

```text
http://localhost:8080
```

Можно также запустить файл `start-server.ps1` из этой папки.

## Как открыть на iPhone

Вариант 1: загрузить папку на любой HTTPS-хостинг, например Netlify, Vercel, GitHub Pages или свой сервер.

Вариант 2: если iPhone и Windows 11 находятся в одной Wi-Fi сети:

1. Запустите локальный сервер на Windows.
2. Узнайте IP-адрес Windows-компьютера в локальной сети.
3. Откройте на iPhone Safari:

```text
http://IP-КОМПЬЮТЕРА:8080
```

4. Нажмите `Share`.
5. Выберите `Add to Home Screen`.

Для полноценной установки PWA и надежной offline-работы лучше использовать HTTPS-хостинг.
