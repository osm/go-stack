import React from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'

const IntlProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { locale: queryLocale } = params

  const requestedLocale = queryLocale || localStorage.getItem('__LOCALE__') || 'en'
  const locale = requestedLocale in messages ? requestedLocale : 'en'

  if (localStorage.getItem('__LOCALE__') !== locale) {
    localStorage.setItem('__LOCALE__', locale)
  }

  return (
    <>
      <ReactIntlProvider messages={messages[locale]} locale={locale} defaultLocale="en">
        {children}
      </ReactIntlProvider>
    </>
  )
}

export default IntlProvider

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: any = {
  sv: {
    'menu.list-todo': 'Lista TODO',
    'menu.create-todo': 'Lägg till TODO',
    'menu.log-out': 'Logga ut',
    'menu.sign-up': 'Skapa konto',
    'menu.log-in': 'Logga in',

    'sign-up.sign-up-button': 'Skapa konto',
    'sign-up.username-label': 'Användarnamn',
    'sign-up.email-label': 'E-post',
    'sign-up.password-label': 'Lösenord',
    'sign-up.confirm-password-label': 'Bekräfta lösenord',
    'sign-up.password-mismatch-label': 'Lösenorden stämmer inte överens',

    'log-in.log-in-button': 'Logga in',
    'log-in.forgot-password-button': 'Glömt lösenordet?',
    'log-in.username-label': 'Användarnamn',
    'log-in.password-label': 'Lösenord',

    'create-todo.title-label': 'Rubrik',
    'create-todo.content-label': 'Innehåll',
    'create-todo.create-button': 'Lägg till',

    'edit-todo.title-label': 'Rubrik',
    'edit-todo.content-label': 'Innehåll',
    'edit-todo.is-done-label': 'Färdig',
    'edit-todo.edit-button': 'Spara',
    'edit-todo.delete-button': 'Ta bort',
    'edit-todo.file-id-label': 'ID',
    'edit-todo.file-modified-at-label': 'Senast ändrad',
    'edit-todo.delete-file-button': 'Ta bort',
    'edit-todo.download-file-button': 'Ladda ner',

    'list-todo.title-label': 'Rubrik',
    'list-todo.modified-at-label': 'Senast redigerad',
    'list-todo.number-of-files': 'Antal filer',
    'list-todo.is-done-label': 'Färdig',
    'list-todo.load-more-button': 'Ladda fler',

    'edit-user-button.button': 'Redigera användare',
    'edit-user-button.header-label': 'Redigera användare',
    'edit-user-button.email-label': 'E-post',
    'edit-user-button.first-name-label': 'Förnamn',
    'edit-user-button.last-name-label': 'Efternamn',
    'edit-user-button.current-password-label': 'Nuvarande lösenord',
    'edit-user-button.new-password-label': 'Nytt lösenord',
    'edit-user-button.confirm-new-password-label': 'Bekräfta lösenord',
    'edit-user-button.password-mismatch-label': 'Lösenorden stämmer inte överens',
    'edit-user-button.save-button': 'Spara',
    'edit-user-button.cancel-button': 'Avbryt',

    'delete-user.delete-user-button': 'Ta bort',
    'delete-user.header-label': 'Ta bort din användare',
    'delete-user.warning':
      'Är du säker på att du vill ta bort din användare? Detta går inte att ångra, all din data kommer att raderas.',
    'delete-user.cancel-button': 'Avbryt',
    'delete-user.delete-button': 'Ta bort',

    'forgot-password.username-label': 'Användarnamn',
    'forgot-password.forgot-password-button': 'Skicka instruktioner',
    'forgot-password.instructions-sent':
      'Instruktioner har skickats till den e-postadress som är kopplad till din användare.',

    'reset-password.new-password-label': 'Nytt lösenord',
    'reset-password.confirm-new-password-label': 'Bekräfta lösenord',
    'reset-password.password-mismatch-label': 'Lösenorden stämmer inte överens',
    'reset-password.set-password-button': 'Sätt lösenord',
  },
}
