import { client } from 'index'

client.listen()
  .catch(() => {
    print('Socket closed')
    os.exit()
  })
