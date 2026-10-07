@echo off
set PGBIN=C:\Users\OUATTARA CLEMENT\Documents\Qoder\2026-10-07\ec944f10\_9boutiques\node_modules\@embedded-postgres\windows-x64\native\bin
set PGDATA=C:\Users\OUATTARA CLEMENT\Documents\Qoder\2026-10-07\ec944f10\_9boutiques\.pgdata
"%PGBIN%\pg_ctl.exe" -D "%PGDATA%" -l "%PGDATA%\pg.log" -w start
