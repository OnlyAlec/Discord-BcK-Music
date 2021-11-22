module.exports = {
	name: 'ready',
	once: true,
	async execute(BcK) {
		const nowmoment = Intl.DateTimeFormat('es-MX', {
			timeStyle: 'long',
		}).format(Date.now());
		
		console.log(`Sesion iniciada como ${BcK.user.tag}! ` + nowmoment);
		BcK.user.setActivity('Music...', {
			type: 'LISTENING',
		});
		await require('../utils/deploy.js').execute();
		BcK.channels.cache.get('832335604611547186').send('> BcK Music - Iniciado ' + nowmoment);
	},
};
