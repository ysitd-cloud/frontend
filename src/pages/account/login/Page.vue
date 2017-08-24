<template>
  <body-display>
    <form method="post" action="/login">
      <v-layout row wrap>
        <v-flex offset-md3 md6 xs12>
          <v-card>
            <v-toolbar class="primary" dark>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span class="red--text" v-if="errorMessage">{{ errorMessage }}</span>
              <v-text-field name="username" label="Username" v-model="username" autofocus required></v-text-field>
              <v-text-field name="password" label="Password" v-model="password" type="password" required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn flat class="primary--text" type="submit">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <input type="hidden" :value="nextUrl" name="next"/>
    </form>
  </body-display>
</template>

<style lang="stylus" src="../../../theme.styl"></style>
<script src="./script.js"></script>
