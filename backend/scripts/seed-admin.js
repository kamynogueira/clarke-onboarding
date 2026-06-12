// Cria ou atualiza usuário admin no Firebase Auth + Firestore
// Uso: node scripts/seed-admin.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const EMAIL = 'kamylla.nogueira@clarke.com.br'
const PASSWORD = '12345678'
const NAME = 'Kamylla Nogueira'

async function run() {
  // 1. Firebase Auth
  let uid
  try {
    const existing = await admin.auth().getUserByEmail(EMAIL)
    uid = existing.uid
    await admin.auth().updateUser(uid, { password: PASSWORD, displayName: NAME, disabled: false })
    console.log(`✓ Firebase Auth: usuário atualizado (uid: ${uid})`)
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const created = await admin.auth().createUser({ email: EMAIL, password: PASSWORD, displayName: NAME })
      uid = created.uid
      console.log(`✓ Firebase Auth: usuário criado (uid: ${uid})`)
    } else {
      throw err
    }
  }

  // 2. Firestore
  const db = admin.firestore()
  const ref = db.collection('users').doc(uid)
  const snap = await ref.get()

  if (snap.exists) {
    await ref.update({ role: 'admin', status: 'active', updatedAt: new Date() })
    console.log('✓ Firestore: documento atualizado para admin/active')
  } else {
    await ref.set({
      name: NAME,
      email: EMAIL,
      phone: '',
      role: 'admin',
      position: '',
      team: '',
      startDate: '',
      twoFactorEnabled: false,
      twoFactorCode: null,
      twoFactorCodeExpiresAt: null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('✓ Firestore: documento criado como admin/active')
  }

  console.log(`\nPronto! Login: ${EMAIL} / Senha: ${PASSWORD}`)
  process.exit(0)
}

run().catch(err => {
  console.error('Erro:', err.message)
  process.exit(1)
})
