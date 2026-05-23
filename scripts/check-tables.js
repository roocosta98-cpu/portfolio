const url = 'https://gcozhjuljappdlvjweuy.supabase.co/rest/v1/site_settings?select=*';
const apikey = 'sb_publishable_5B4_29YlovdfbFWsCXRcsw_dR9xyF5v';

async function check() {
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`
      }
    });
    console.log('Status site_settings:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (err) {
    console.error('Error fetching site_settings:', err);
  }

  try {
    const resSkills = await fetch('https://gcozhjuljappdlvjweuy.supabase.co/rest/v1/skill_categories?select=*', {
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`
      }
    });
    console.log('Status skill_categories:', resSkills.status);
    const dataSkills = await resSkills.json();
    console.log('Data skill_categories:', dataSkills);
  } catch (err) {
    console.error('Error fetching skill_categories:', err);
  }
}

check();
