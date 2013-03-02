var Melodies01 = function() {
	var synth = null;
	this.audiolet = new Audiolet()
	, Synth = function(audiolet, freq, pan, scale, sus, att, finalMul) {
		AudioletGroup.apply(this, [audiolet, 0, 2]);
		this.frequency = freq || 440;
		this.pulse = new Pulse(audiolet, this.frequency);
		this.saw = new Saw(audiolet, this.frequency);
		this.mul1 = new Multiply(audiolet);
		
		this.lfo1 = new Sine(audiolet, this.frequency / scale || 6);
		this.lfo1MulAdd = new MulAdd(audiolet, 0.5, 1);
		this.lfo1.connect(this.lfo1MulAdd);
		this.lfo1Mul = new Multiply(audiolet, 10);
		this.lfo1MulAdd.connect(this.lfo1Mul);
		this.saw.connect(this.mul1, 0, 1);
		this.pulse.connect(this.mul1);
		this.lfo1MulAdd.connect(this.pulse,0,1);
		//this.comb1 = new CombFilter(audiolet, 0.7, 0.6, 0.3);
		//this.lfo1Mul.connect(this.comb1, 0, 1);
		//this.mul1.connect(this.comb1);
		this.add1 = new Add(audiolet);
		//this.comb1.connect(this.add1, 0, 1);
		this.mul1.connect(this.add1);
		this.lfo2MulAdd = new MulAdd(audiolet, 2900, 100);
		this.lfo1MulAdd.connect(this.lfo2MulAdd);
		this.filter = new LowPassFilter(audiolet);
		this.lfo2MulAdd.connect(this.filter, 0, 1);
		this.add1.connect(this.filter);
		this.adsr = new ADSREnvelope(audiolet, 1, att || 0.01, 0.4, sus || 0, 0.3, function(){
			this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
			}.bind(this));
		this.gain = new Gain(audiolet);
		this.filter.connect(this.gain);
		//this.delay = new FeedbackDelay(audiolet, 0.7, 0.6, 0.3);
		
		this.adsr.connect(this.gain, 0,1);
		//this.gain.connect(this.delay);
		//this.delay.connect(this.outputs[0]);
		this.reverb = new Reverb(audiolet, 0.7, 0.5, 0.3);
		this.add = new Add(audiolet);
		this.gain.connect(this.add);
		//this.delay.connect(this.add, 0, 1);
		this.add.connect(this.reverb);
		this.pan = new Pan(audiolet, pan);
		//this.reverb.connect(this.pan);
		this.finalmul = new Multiply(audiolet, finalMul || 0.5);
		this.reverb.connect(this.finalmul);
		this.finalmul.connect(this.pan);
		this.pan.connect(this.outputs[0]);
		this.pan.connect(this.outputs[1]);
		
	};

	extend(Synth, AudioletGroup);
	//this.play = function() {
		this.audiolet.scheduler.setTempo(100);
		var type = 'major';
		var type2 = 'harmonic minor';
		var d = Note.fromLatin('D#3');
		var dscale = d.scale(type);
		var dscale1 = dscale.slice(0,4);
		var dscale2 = dscale.slice(4,8);
		var f = Note.fromLatin('F#3')
		var fscale = f.scale(type);
		var fscale1 = fscale.slice(0,4);
		var fscale2 = fscale.slice(4,8);
		var b = Note.fromLatin('B3');
		var bscale = b.scale(type);
		var bscale1 = bscale.slice(0,4);
		var bscale2 = bscale.slice(4,8);
		var c = Note.fromLatin('C#2');
		var cscale = c.scale(type);
		var cscale1 = cscale.slice(0,4);
		var cscale2 = cscale.slice(4,8);
		
		var d2 = Note.fromLatin('G5');
		var d2scale = d2.scale(type2);
		var d2scale1 = d2scale.slice(0,4);
		var d2scale2 = d2scale.slice(4,8);
		var f2 = Note.fromLatin('A#5')
		var f2scale = f2.scale(type2);
		var f2scale1 = f2scale.slice(0,4);
		var f2scale2 = f2scale.slice(4,8);
		var b2 = Note.fromLatin('D#5');
		var b2scale = b.scale(type2);
		var b2scale1 = b2scale.slice(0,4);
		var b2scale2 = b2scale.slice(4,8);
		var c2 = Note.fromLatin('E6');
		var c2scale = c2.scale(type2);
		var c2scale1 = c2scale.slice(0,4);
		var c2scale2 = c2scale.slice(4,8);
		var frequencyPattern1 = new PSequence([
			new PSequence(dscale1), new PSequence(fscale1), new PSequence(bscale1), new PSequence(cscale1),
			new PSequence(dscale2), new PSequence(fscale2), new PSequence(bscale2), new PSequence(cscale2),
			new PSequence(dscale1), new PSequence(fscale1.reverse()), new PSequence(bscale1.reverse()), new PSequence(cscale1.reverse()),
			new PSequence(dscale2.reverse()), new PSequence(fscale2.reverse()), new PSequence(bscale2.reverse(), new PSequence(cscale1.reverse()))
			], Infinity);
			var frequencyPattern2 = new PSequence([
			new PSequence(d2scale1), new PSequence(f2scale1), new PSequence(b2scale1), new PSequence(c2scale1),
			new PSequence(d2scale2), new PSequence(f2scale2), new PSequence(b2scale2), new PSequence(c2scale2),
			new PSequence(d2scale1), new PSequence(f2scale1.reverse()), new PSequence(b2scale1.reverse()), new PSequence(c2scale1.reverse()),
			new PSequence(d2scale2.reverse()), new PSequence(f2scale2.reverse()), new PSequence(b2scale2.reverse(), new PSequence(c2scale1.reverse()))
			], Infinity);
		var scalePattern1 = new PSequence([1,4,2,4,3,4,4,6,4,6], Infinity);
		var scalePattern2 = new PSequence([3,6,4,6,5,6,6,8,6,8], Infinity);
		var susPattern1 = new PSequence([0,0,0,0,0,0.1], Infinity);
		var susPattern2 = new PSequence([0,0,0,0.2], Infinity);
		var durationPattern1 = new PSequence([new PSequence([1,1,1,2,1,1,1,3], 8), new PRandom(1, 2, 64), new PSequence([1,1,1,2,1,1,1,3], 8), new PRandom(1, 4, 64),new PSequence([(2/3),(2/3),(2/3),(2/3),(2/3),(2/3),(2/3),(2/3)], 8)], Infinity);
		var durationPattern2 = new PSequence([new PSequence([1/2,1/2,1/2,1/2,1/2,1,1/2,3/2], 16), new PRandom(1, 2, 64), new PSequence([1/2,1/2,1/2,1/2,1/2,1,1/2,3/2], 16), new PRandom(1, 4, 64),new PSequence([(2/3),(2/3),(2/3),(2/3),(2/3),(2/3),(2/3),(2/3)], 8)], Infinity);
		var synth = new Synth(this.audiolet, 440, 0.3, 4);
		var synth2 = new Synth(this.audiolet, 440, 0.6, 6);
		var attPattern1 = new PChoose([0.01,0.01,0.01, 0.1, 1, 2, 0.5, 0.75, 0.005], Infinity);
		var finalMulPattern1 = new PSequence([0.5, 0.1, 0.5, 0.1, 0.2, 0.5, 0.2, 0.5, 0.2, 0.3], Infinity);
		var finalMulPattern2 = new PSequence([0.1, 0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2, 0.1, 0.5,0.5,0.5,0.5], Infinity);
		this.audiolet.scheduler.play([frequencyPattern1, scalePattern2, susPattern1, attPattern1, finalMulPattern1], durationPattern1, function(frequency, scale, sus, att, mul){
			synth.adsr.gate.setValue(0);
			synth = new Synth(this.audiolet, frequency.frequency(), 0.3, scale, sus, att, mul);
			synth.connect(this.audiolet.output);
			
		}.bind(this));
		this.audiolet.scheduler.play([frequencyPattern2, scalePattern1, susPattern2, attPattern1, finalMulPattern2], durationPattern2, function(frequency, scale, sus, att, mul){
			synth2.adsr.gate.setValue(0);
			synth2 = new Synth(this.audiolet, frequency.frequency(), 0.6, scale, sus, att, mul);
			synth2.connect(this.audiolet.output);
			
		}.bind(this));
	
}
