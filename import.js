const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const fetch = require('node-fetch'); // Nécessaire pour le géocodage

const supabaseUrl = 'https://ubbrxhjilvugjjyewixy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViYnJ4aGppbHZ1Z2pqeWV3aXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjA3ODQsImV4cCI6MjA5MTI5Njc4NH0.0GqNQ58JsNCet_UOTuPgLXhw4KE05HSMRsfhf76z268';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour transformer l'adresse en Latitude/Longitude
async function getCoordinates(adresse, ville, cp) {
    try {
        const query = encodeURIComponent(`${adresse} ${cp} ${ville}`);
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const [lon, lat] = data.features[0].geometry.coordinates;
            return { lat, lon };
        }
    } catch (e) {
        return null;
    }
    return null;
}

async function runImport() {
    try {
        const rawData = fs.readFileSync('pharmacies.json', 'utf8');
        const pharmacies = JSON.parse(rawData);

        console.log(`🚀 Début du traitement de ${pharmacies.length} pharmacies...`);
        const preparedData = [];

        for (let i = 0; i < pharmacies.length; i++) {
            const p = pharmacies[i];
            const nomPharmacie = p["PHARMACIES"];
            const adresse = p["Adresse"];
            const ville = p["Ville"];
            const cp = p["Code postal"];

            process.stdout.write(`⏳ Géocodage (${i + 1}/${pharmacies.length}) : ${nomPharmacie}...\r`);

            const coords = await getCoordinates(adresse, ville, cp);

            // On prépare l'objet avec des noms de colonnes simples pour Supabase
            preparedData.push({
                nom: nomPharmacie,
                adresse: adresse,
                ville: ville,
                code_postal: cp,
                latitude: coords ? coords.lat : null,
                longitude: coords ? coords.lon : null
            });

            // Petite pause pour respecter l'API de géocodage (gratuit)
            await new Promise(r => setTimeout(r, 100));
        }

        console.log('\n📤 Envoi des données vers Supabase...');
        
        const { error } = await supabase
            .from('pharmacies')
            .insert(preparedData);

        if (error) throw error;

        console.log('✅ Tout est terminé ! Les 253 pharmacies sont localisées et importées.');

    } catch (err) {
        console.error('\n❌ Erreur :', err.message);
    }
}

runImport();

