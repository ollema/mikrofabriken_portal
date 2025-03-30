<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();

	const members: {
		name: string;
		slackID: string;
		rfidData: string;
		investment: boolean;
		link: string | null;
	}[] = $state([]);

	function addNewMember() {
		members.push({
			name: '',
			slackID: '',
			rfidData: '',
			investment: false,
			link: null
		});
	}

	const membersWithLinks = $derived.by(() => {
		return members.map((member) => {
			if (member.name !== '' && member.slackID !== '' && member.rfidData !== '') {
				const input = {
					name: member.name,
					slackID: member.slackID,
					rfidData: member.rfidData,
					investment: member.investment
				};
				const encoded = encodeURIComponent(btoa(JSON.stringify(input)));
				const link = new URL(
					`https://portal.mikrofabriken.se/new/${data.newMemberKey}?data=${encoded}`
				).toString();

				return { ...member, link };
			} else {
				return { ...member, link: null };
			}
		});
	});
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Inval</PageHeader.Title>
			<PageHeader.Description>Inval av nya medlemmar</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div>
		<Accordion.Root type="multiple" class="w-full sm:max-w-[70%]">
			<Accordion.Item value="step-1">
				<Accordion.Trigger>1. Verifiera att det inte finns en invalsbranch</Accordion.Trigger>
				<Accordion.Content>
					<div>Portalen försöker återanvända existerande branches om möjligt.</div>
					<div class="mt-2">
						Säkerställ därför att det inte redan finns en branch för inval av nya medlemmar i
						GitLab.
					</div>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="step-2">
				<Accordion.Trigger>2. Fyll i namn</Accordion.Trigger>
				<Accordion.Content>
					<div>Egentligen mest för att hålla koll på vem som är vem just på den här sidan.</div>
					<div class="mt-2">
						Medlemmarna kan korrigera namn när de själva fyller i sin information.
					</div>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="step-3">
				<Accordion.Trigger>3. Fyll i Slack IDs</Accordion.Trigger>
				<Accordion.Content>
					<div>Gå till varje ny medlems profil på Slack och välj kopiera ID.</div>
					<div class="mt-2">
						Slack ID används för att associera en inloggning via Slack OAuth2 mot en medlem i
						medlemslistan.
					</div>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="step-4">
				<Accordion.Trigger>4. Fyll i RFID-data</Accordion.Trigger>
				<Accordion.Content>
					<div>
						Anslut RFID-läsaren till din dator. Blippa en RFID-tagg så kommer den att spotta ut text
						som att den vore ett tangentbord. Denna text motsvarar datan på RFID-taggen. Vi använder
						den här datan tillsammans med en PIN-kod för att ge tillgång till lokalerna.
					</div>
					<div class="mt-2 font-semibold">
						Skriv ner varje ny medlems namn och sätt på lappar på RFID-taggarna för att hålla reda
						på vilken tagg som är kopplad till varje ny medlem.
					</div>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="step-5">
				<Accordion.Trigger>5. Fyll i insats</Accordion.Trigger>
				<Accordion.Content>
					<div>Verifiera om de nya medlemmarna vill gå in med insats.</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>

	<div class="mt-4">
		{#each members as member, i}
			{#if i > 0}
				<Separator class="my-12 max-w-md" />
			{/if}
			<div class="mt-4 flex max-w-md flex-col gap-2">
				<Input type="text" placeholder="Namn" bind:value={member.name} />
				<Input type="text" placeholder="Slack ID" bind:value={member.slackID} />
				<Input type="text" placeholder="RFID-data" bind:value={member.rfidData} />
				<div class="mt-2 flex items-center gap-2">
					<Checkbox id="insats" placeholder="Insats" bind:checked={member.investment} />
					<Label for="insats">Medlemmen vill teckna insats</Label>
				</div>
				{#if membersWithLinks[i].link !== null}
					<div class="overflow-scroll text-xs text-muted-foreground">
						{membersWithLinks[i].link}
					</div>
					<Button
						variant="outline"
						size="sm"
						class="mt-2"
						onclick={() => {
							const link = membersWithLinks[i].link;
							if (!link) return;
							const message = `Hej ${member.name}! Välkommen till Mikrofabriken. Klicka på länken för att registrera dig: ${link}`;
							navigator.clipboard.writeText(message);
						}}
					>
						Kopiera meddelande att skicka till ny medlem
					</Button>
				{/if}
			</div>
		{/each}
	</div>

	<div class="mt-4">
		<Button variant="outline" onclick={addNewMember}>Lägg till ny medlem</Button>
	</div>
</div>
