// const FILE_IDS = {
//     2001: "196gkFxm2n6FsSdACl3fLKIH98G4rr3Nc",
//     2002: "1sfKwHB0zl0s4hAlBOkgkuKo_Gdi0tYio",
//     2003: "1D1i2dSYZrapO3Fz2qtTAMh4hsgAG8BKU",
//     // ... continue for all years
//     2004: "1-8E9Bm_pbmb8mMmhrmGwQI9-SENRkzhO",
//     2005: "1q4UOG2aTBAgANfXl6Q5UVYO92_a3CEIO",
//     2006: "11Tgrktrjuxnqk6lu5VDqsYgOHQTe056j",
//     2007: "1oBPVZ-ngetMmu7W9m7tD2SqPowm1mXdm",
//     2008: "12ObnKyW7ccObISSdGJR5xyw386UTgKUe",
//     2009: "1v-VFab3cGE5EvzkhgBirSGSnY7OMMiaZ",
//     2010: "1lNSReEB4dHjl9XxzEfaGWeWALeAjufJV",
//     2011: "1fWVm6h5XxeWNvIHW19GRkqbGLRhIjnfQ",
//     2012: "1HyxvnRJhwyOkV3rhQxylz3xH7IkKwmia",
//     2013: "1KJaWAGk-xeAjB80tKilRJ3praTvKJChw",
//     2014: "1pECnp2nZ1X7Z0j6V0Az0Ea-gYI8xk7H0",
//     2015: "15Hi4vhQ1QP_O_iPgx8eKJ0oK4yt5tEIx",
//     2016: "1vVx9-44Mu24nVDWf3oR-X1IgjZTzRmc-",
//     2017: "1gYpcVaqPggQWRLE75xFVLUKTJlNQop7X",
//     2018: "1gJy3fpe-MHTKrQq8d9qwOk_joibnDc1d",
//     2019: "1lEJ2MH86x4gXstdf79QiHGEd5bSOHVnb",
//     2020: "1ogXuNbeOEObtsdcn1Vyc-TOQqrFBDlVe",
//     2021: "16I6-TpQDQ7egLlc2hQLGU1xz9tZDEggP",
//     2022: "1UgC13MDuRXhXBoum-RVNjjqEs8O8pb7u",
//     2023: "1APF9m2pfpkurtEoF1WOiKrd4QDgMmRYe",
//     2024: "1nMQ2pkpkT09fnJXr87j6cUMA5hwk_UTl"
//   };
  
  // Converts Google Drive share link to direct image URL
  
  export const getTextureUrl = (year) => {
    // Only support years that exist
    if (year >= 2001 && year <= 2024) {
      return `/textures/${year}.png`;
    }
    console.warn(`No land cover data for year: ${year}`);
    return null;
  };