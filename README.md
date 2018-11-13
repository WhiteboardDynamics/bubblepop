# Bubble Pop!

## Building the mobile app

1. Create a free account on [Phonegap Build](https://build.phonegap.com/).
2. Create a zip file of your the `www` directory, `config.xml`, and any resources for the application (`bubblepop.png`). Select all of them, `right click` -> `Zip selection`
3. Upload your zip file to Phonegap Build. Select private application and upload zip.
4. Whenever you update the code for the application, Phonegap Build will automatically rebuild your application. This will give you an APK download button to download the built APK. Load the APK into an emulator (via drag and drop) or load it onto an Android phone to enjoy a simple bubble popping game!

## Deploying with Google Play Store

1. Go to the (Play Console)[https://play.google.com/apps/publish/signup/].
2. You will need to accept some conditions and pay a registration fee.
3. Then set up some account details about yourself.
4. Create a new application, setting the name and language.
5. Fill out the various detailed information, and add images and screenshots.
6. Upload an APK for a production release which needs to be signed and non-debuggable. Read the section on using phonegap to generate a signed APK to get an APK for this step.
6. Fill out pricing and distribution tab, make sure to add the US as a country.
7. Complete rating questionaire.
8. Now the application can be released to the play store.

## Using Phonegap Build to generate a signed APK

The only additional thing that Phonegap Build needs to generate a
signed APK is a keystore to sign the application with. These
unfortunately cannot be created on ChromeOS. On a system with
`keytool` installed this command will generate a new keystore called
`release.keystore` with a key called `key0`. The command will prompt
for a password to secure the keystore, and some user information to
tie the signatures back to a user.

```keytool -genkey -v -keystore release.keystore -alias key0 -keyalg RSA -keysize 2048 -validity 10000```

Once you have a keystore you can add it to Phonegap Build to allow it
to build a signed APK. After uploading the keystore you will have to
give Phonegap Build the password used to create the keystore to unlock
the key for signing. You can then download the signed APK and upload
it to the Play Store.

## Helpful links

* [HTML Canvas Reference](https://www.w3schools.com/tags/ref_canvas.asp)
* [Javascript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
* [Apache Cordova](https://cordova.apache.org/docs/en/latest/)
* [Adobe Phonegap](http://docs.phonegap.com/)
