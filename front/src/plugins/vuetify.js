import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'customDark',
    themes: {
      customDark: {
        dark: true,
        colors: {
          background: '#242424',   // <- ТВОЙ ЦВЕТ ФОНА
          surface: '#2c2c3c',
          primary: '#ffb703',
          secondary: '#8ecae6',
          error: '#f28b82',
          success: '#a5e6b3',
          warning: '#fdd663',
          info: '#7fe0dc',
          customBlue: "#99a6ec",
          customBlueHover: '#7e8fe0',
          card: "#1e1e1e",
          border: '#3a3a3a'
          
        },
      },
    },
  },
})
