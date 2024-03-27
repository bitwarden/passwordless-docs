<template>
  <div>
    <div v-if="platform">
      <button class="button" :disabled="loading" @click="fire">
        Try: Sign in using passwordless
      </button>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
import Passwordless from '@passwordlessdev/passwordless-client';
import { generateName } from './RandomName';

// Passwordless integration
const apiKey = 'demobackend:public:c203e65b581443778ea4823b3ef0d6af';
const backendUrl = 'https://demo-backend.passwordless.dev';

const p = new Passwordless.Client({ apiKey });

async function Register(alias) {
  const myToken = await fetch(backendUrl + '/create-token?alias=' + alias).then((r) => r.text());
  await p.register(myToken);
  console.log('Register succeded');
}

async function Signin(alias) {
  const token = await p.signinWithAlias(alias);
  const user = await fetch(backendUrl + '/verify-signin?token=' + token).then((r) => r.json());
  console.log('User details', user);
  return user;
}

export default {
  data: () => {
    return {
      loading: false,
      message: '',
      platform: false
    };
  },
  mounted() {
    const cached = localStorage.getItem('isPlatformSupported');
    if (cached) {
      this.platform = true;
    }
  },
  methods: {
    async scriptload() {
      const res = await Passwordless.isPlatformSupported();
      localStorage.setItem('isPlatformSupporterd', res);
      if (res) {
        this.platform = true;
      } else {
        this.platform = false;
      }
    },
    async fire() {
      // Create a random userid
      this.loading = true;
      var alias = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5);
      try {
        this.message = '🔒 Loading...';
        await Register('Mr Guest ' + generateName());
        this.message = '✅ Authentication success';
      } catch (error) {
        this.message = '⚠ Something went wrong, please see console for error message';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.button {
  padding: 16px 28px;
  background: #0f207b;
  color: #a4d7f0;
  border: none;
  border-radius: 100px;
  cursor: pointer;
}

.button:hover {
  background: #1b33b3;
}
</style>
