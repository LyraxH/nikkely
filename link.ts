interface Nikke {
    nikke_id?: number;
    name: string;
    rarity: number;
    manufacturer: string;
    element: string;
    weapon: string;
    role: string;
    squad: string;
    burst: number;
}

async function fetchData(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/nikkes');
        const data: Nikke[] = await response.json();
        const listElement = document.getElementById('nikkes');
        if (!listElement) return;
        listElement.innerHTML = data.map(nikke => {
            const rarityKey: Record<number, string> = { 1: 'r', 2: 'sr', 3: 'ssr' };
            const rarityName = rarityKey[Number(nikke.rarity)] || 'ssr';
            return `
                <div class="card">
                    <h2>${nikke.name}</h2>
                    <img src="/images/${rarityName}.webp" width="48" height="48" class="rarity-icon"> 
                    <img src="/images/${nikke.manufacturer.toLowerCase()}.webp" width="48" height="48" title="${nikke.manufacturer}">
                    <img src="/images/${nikke.element.toLowerCase()}.webp" width="48" height="48" title="${nikke.element}">
                    <img src="/images/b${nikke.burst}.webp" width="45" height="48" title="Burst ${nikke.burst}">
                    <img src="/images/${nikke.role.toLowerCase()}.webp" width="40" height="48" title="${nikke.role}">
                    <img src="/images/${nikke.weapon.toLowerCase()}.webp" width="48" height="48" title="${nikke.weapon}">
                    <p><b>Squad:</b> ${nikke.squad}</p>
                    <button class="delete-btn" onclick="deleteNikke(${nikke.nikke_id})">
                        <i class="fa fa-trash"></i> Delete
                    </button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Failed to fetch:", error);
    }
}
const skillForm = document.getElementById('skillForm') as HTMLFormElement;
if (skillForm) {
    skillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nikkeName = (document.getElementById('nikke-name') as HTMLInputElement).value;
        try {
            const idResponse = await fetch(`http://localhost:3000/nikke-by-name/${encodeURIComponent(nikkeName)}`);
            if (!idResponse.ok) {
                alert("Nikke not found! Please check the name.");
                return;
            }
            const { nikke_id } = await idResponse.json();
            const payload = {
                nikke_id: nikke_id,
                skill_name: (document.getElementById('skill-name') as HTMLInputElement).value,
                type: (document.getElementById('type') as HTMLInputElement).value,
                cooldown: (document.getElementById('cooldown') as HTMLInputElement).value,
                description: (document.getElementById('skill-description') as HTMLInputElement).value,
            };
            const response = await fetch('http://localhost:3000/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error.includes("UNIQUE constraint failed")) {
                    alert("This Nikke already has a skill assigned to this slot (Skill 1, 2, or Burst).");
                } else {
                    alert("Error adding skill: " + errorData.error);
                }
                return;
            }
            console.log("Skill added!");
            (document.getElementById('skill-name') as HTMLInputElement).value = '';
            (document.getElementById('skill-description') as HTMLInputElement).value = '';
            fetchData();
        } catch (error) {
            console.error("Error during submission:", error);
        }
    });
}
const nikkeForm = document.getElementById('nikkeForm') as HTMLFormElement;
if (nikkeForm) {
    nikkeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            rarity: Number((document.getElementById('rarity') as HTMLInputElement).value),
            manufacturer: (document.getElementById('manufacturer') as HTMLInputElement).value,
            element: (document.getElementById('element') as HTMLInputElement).value,
            burst: Number((document.getElementById('burst') as HTMLInputElement).value),
            role: (document.getElementById('role') as HTMLInputElement).value,
            weapon: (document.getElementById('weapon') as HTMLInputElement).value,
            squad: (document.getElementById('squad') as HTMLInputElement).value,
        };
        try {
            const response = await fetch('http://localhost:3000/nikkes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log("Nikke added!");
                nikkeForm.reset();
                fetchData();
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    });
}

(window as any).deleteNikke = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Nikke?")) return;
    try {
        const response = await fetch(`http://localhost:3000/nikkes/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchData();
        }
    } catch (error) {
        console.error("Delete failed:", error);
    }
};

fetchData();

function setupButtonGroup(groupId: string, inputId: string) {
    const group = document.getElementById(groupId);
    const hiddenInput = document.getElementById(inputId) as HTMLInputElement;
    if (!group || !hiddenInput) return;
    const buttons = group.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            hiddenInput.value = btn.getAttribute('data-value') || "";
        });
    });
}

setupButtonGroup('rarity-group', 'rarity');
setupButtonGroup('weapon-group', 'weapon');
setupButtonGroup('role-group', 'role');
setupButtonGroup('element-group', 'element');
setupButtonGroup('burst-group', 'burst');
setupButtonGroup('manufacturer-group', 'manufacturer');

setupButtonGroup('skill-type', 'type');
setupButtonGroup('skill-cooldown', 'cooldown');