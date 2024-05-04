import { proxy } from 'valtio'

const state = proxy({
  intro: false,
  colors: ['#ffffff', '#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934', '#000000'],
  decals: ['react', 'three2', 'pmndrs'],
  color: '#EFBD4E',
  decal: 'three2'
})

export { state }
