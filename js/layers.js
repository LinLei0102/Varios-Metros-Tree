addLayer("p", {
    name: "P", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "数米", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "金币", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.mul(getLevel().div(2).max(1));
		if(getELevel().gte(1500))mult = mult.mul(getELevel().div(100).max(1)); else mult = mult.mul(getELevel().sqrt().div(4).max(1));
		if(getRank().gte(15))mult = mult.mul(getRank().div(2).max(1));else mult = mult.mul(getRank().div(5).add(1));
		if(hasAchievement("a",111))mult = mult.mul(player.a.points.add(1));else if(hasAchievement("a",11))mult = mult.mul(player.a.points.div(10).add(1));
		mult = mult.mul(layers.s.effect3());
		if(hasAchievement("a",14) && a)mult = mult.mul(2);
		if(hasAchievement("a",24) && a)mult = mult.mul(2);
		if(hasAchievement("a",34) && a)mult = mult.mul(2);
		if(hasAchievement("a",44) && a)mult = mult.mul(2);
		mult = mult.mul(buyableEffect("t",11));
		if(getLevel().gte(25) && a)mult = mult.mul(2);
		if(getRank().gte(6) && a)mult = mult.mul(2);
		if(getLevel().gte(30) && Math.random()<getLevel().mul(200).cbrt().div((getLevel().gte(50) && a)?100:200).max(0.1).min(2).toNumber())mult = mult.mul(2);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	clickables: {
            11: {
                title: "开始数米",
                display(){
					return "+"+formatWhole(buyableEffect("p",11))+"粒米";
				},
                unlocked() { return true}, 
				canClick(){return true},
				onClick(){
					player.points=player.points.add(buyableEffect("p",11));
					if(getLevel().gte(25)){
						player.p.points=player.p.points.add(layers.p.gainMult(1));
					}else if(getLevel().gte(1)){
						if(Math.random()<getLevel().mul(3).sqrt().div(10).min(2).toNumber())player.p.points=player.p.points.add(layers.p.gainMult(1));
					}
				},
                style: {'height':'100px','width':'150px'},
            },
            12: {
                title: "释放米袋",
                display(){
					return "+"+formatWhole(player.inactive)+"粒米";
				},
                unlocked() { return getLevel().gte(10)}, 
				canClick(){return true},
				onClick(){
					player.points=player.points.add(player.inactive);player.inactive=new Decimal(0);
				},
                style: {'height':'100px','width':'150px'},
            },
            13: {
                title: "自动购买数米能力",
                display(){
					return player.p.a1?("已开启"):"已关闭";
				},
                unlocked() { return getLevel().gte(20)}, 
				canClick(){return true},
				onClick(){
					player.p.a1=!player.p.a1;
				},
                style: {'height':'100px','width':'150px'},
            },
            14: {
                title: "自动购买自动数米",
                display(){
					return player.p.a2?("已开启"):"已关闭";
				},
                unlocked() { return getELevel().gte(100)}, 
				canClick(){return true},
				onClick(){
					player.p.a2=!player.p.a2;
				},
                style: {'height':'100px','width':'150px'},
            },
            21: {
                title: "自动购买米袋升级",
                display(){
					return player.p.a3?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(10)}, 
				canClick(){return true},
				onClick(){
					player.p.a3=!player.p.a3;
				},
                style: {'height':'100px','width':'150px'},
            },
            22: {
                title: "自动购买数米加成",
                display(){
					return player.p.a4?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(50)}, 
				canClick(){return true},
				onClick(){
					player.p.a4=!player.p.a4;
				},
                style: {'height':'100px','width':'150px'},
            },
            23: {
                title: "自动购买自动数米加成",
                display(){
					return player.p.a5?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(70)}, 
				canClick(){return true},
				onClick(){
					player.p.a5=!player.p.a5;
				},
                style: {'height':'100px','width':'150px'},
            },
            24: {
                title: "自动购买米袋加成",
                display(){
					return player.p.a6?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(185)}, 
				canClick(){return true},
				onClick(){
					player.p.a6=!player.p.a6;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	update(diff){
		if(getLevel().gte(5)){
			if(Math.random()<getLevel().mul(3).sqrt().div(10).min(2).toNumber())player.p.points=player.p.points.add(layers.p.gainMult().mul(diff).mul(buyableEffect("p",12)));
		}
		if(getLevel().gte(10)){
			player.inactive=player.inactive.add(buyableEffect("p",11).mul(buyableEffect("p",12)).mul(buyableEffect("p",21)).mul(diff));
		}
		if(getRank().gte(2)){
			if(player.s.a1)player.s.points=player.s.points.add(player.inactive.mul(new Decimal(1).sub(getRank().sqrt().mul(0.1).add(1).pow(-diff))));
			else player.points=player.points.add(player.inactive.mul(new Decimal(1).sub(getRank().sqrt().mul(0.1).add(1).pow(-diff))));
			player.inactive=player.inactive.mul(getRank().sqrt().mul(0.1).add(1).pow(-diff)).max(0);
		}
		if(getLevel().gte(20)&&player.p.a1){
			let tmp=player.p.points.div(layers.t.buyables[23].effect().mul(buyableEffect("t",21).max(0.01)).mul(101)).ceil();
			if(tmp.mul(layers.t.buyables[23].effect()).gte(player.p.points))return;
			player.p.buyables[11]=player.p.buyables[11].add(tmp);
			player.p.points=player.p.points.sub(tmp.mul(layers.t.buyables[23].effect()).mul(buyableEffect("t",21).max(0.01)));
		}
		if(getRank().gte(32)&&player.p.a2){
			let target=player.p.points.mul(8).add(player.p.buyables[12].pow(4)).root(4).floor().max(player.p.buyables[12]);
			if(player.p.points.gte(target.pow(4).sub(player.p.buyables[12].pow(4)).div(8))){
				player.p.points=player.p.points.sub(target.pow(4).sub(player.p.buyables[12].pow(4)).div(8).mul(buyableEffect("t",21)));
				player.p.buyables[12]=target;
			}
		}else if(getELevel().gte(100)&&player.p.a2){
			if(player.p.points.gte(layers.p.buyables[12].cost())){
				player.p.points=player.p.points.sub(layers.p.buyables[12].cost().mul(buyableEffect("t",21)));
				player.p.buyables[12]=player.p.buyables[12].add(1);
			}
		}
		if(getRank().gte(21)&&player.p.a3){
			let target=player.p.points.div(10).add(player.p.buyables[21].pow(3)).cbrt().floor().max(player.p.buyables[21]);
			if(player.p.points.gte(target.pow(3).sub(player.p.buyables[21].pow(3)))){
				player.p.points=player.p.points.sub(target.pow(3).sub(player.p.buyables[21].pow(3)).mul(buyableEffect("t",21)));
				player.p.buyables[21]=target;
			}
		}else if(getRank().gte(10)&&player.p.a3){
			if(player.p.points.gte(layers.p.buyables[21].cost().mul(10))){
				player.p.points=player.p.points.sub(layers.p.buyables[21].cost().mul(buyableEffect("t",21)));
				player.p.buyables[21]=player.p.buyables[21].add(1);
			}
		}
		if(getRank().gte(50)&&player.p.a4){
			let target=player.p.points.div(2).add(player.p.buyables[13].pow(6)).root(6).floor().max(player.p.buyables[13]);
			if(player.p.points.gte(target.pow(6).sub(player.p.buyables[13].pow(6)))){
				player.p.points=player.p.points.sub(target.pow(6).sub(player.p.buyables[13].pow(6)).mul(buyableEffect("t",21)));
				player.p.buyables[13]=target;
			}
		}
		if(getRank().gte(70)&&player.p.a5){
			let target=player.p.points.add(player.p.buyables[22].pow(9)).root(9).floor().max(player.p.buyables[22]);
			if(player.p.points.gte(target.pow(9).sub(player.p.buyables[22].pow(9)))){
				player.p.points=player.p.points.sub(target.pow(9).sub(player.p.buyables[22].pow(9)).mul(buyableEffect("t",21)));
				player.p.buyables[22]=target;
			}
		}
		if(getRank().gte(185)&&player.p.a6){
			let target=player.p.points.add(player.p.buyables[23].pow(15)).root(15).floor().max(player.p.buyables[23]);
			if(player.p.points.gte(target.pow(15).sub(player.p.buyables[23].pow(15)))){
				player.p.points=player.p.points.sub(target.pow(15).sub(player.p.buyables[23].pow(15)).mul(buyableEffect("t",21)));
				player.p.buyables[23]=target;
			}
		}
	},
	tabFormat: [
		"main-display","clickables","buyables","milestones"
	],
    layerShown(){return true},
	buyables: {
            11: {
                title: "数米能力", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = layers.t.buyables[23].effect()
                    return cost
                },
				totalCost(){
					return player[this.layer].buyables[this.id].mul(layers.t.buyables[23].effect());
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.add(1, x.pow(layers.g.effect2()))
					if(getRank().gte(4))eff = eff.mul(getLevel().div(400));
					if(getRank().gte(7))eff = eff.mul(buyableEffect("p",13));
					if(getELevel().gte(150))eff = eff.mul(getELevel().div(100));
					eff = eff.mul(buyableEffect("t",12));
					if(hasAchievement("a",26))eff = eff.mul(player.a.points.div(10).add(1));
					eff = eff.mul(getRankEffect2());
					eff = eff.mul(layers.s.effect1());
					eff = eff.mul(layers.n.effect());
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(100)?"<sup>"+format(layers.g.effect2())+"</sup>":"")+"\n\
					数米能力：" + formatWhole(data.effect) + "粒/次\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(15)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getLevel().gte(2) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21).max(0.1)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "自动数米", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(3)
					if(getRank().gte(32))cost=x.pow(3).add(x).mul(0.5).add(x.pow(2).mul(0.75).add(0.125)).ceil();
                    return cost
                },
				totalCost(){
					if(getRank().gte(32))return player[this.layer].buyables[this.id].pow(4).div(8);
					return player[this.layer].buyables[this.id].mul(player[this.layer].buyables[this.id].add(1)).div(2).pow(2);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x)
					eff = eff.mul(buyableEffect("p",22));
					eff = eff.mul(buyableEffect("t",22));
					if(hasAchievement("a",71))eff = eff.mul(buyableEffect("p",21).add(1));
					eff = eff.mul(layers.s.effect7());
					eff = eff.mul(layers.g.effect1());
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					自动数米：" + formatWhole(data.effect) + "次/秒\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(15)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getLevel().gte(5) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            13: {
                title: "数米加成", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(6)
					if(getRank().gte(48)){
						cost = x.pow(5).mul(6).add(x.pow(4).mul(15)).add(x.pow(3).mul(20)).add(x.pow(2).mul(15)).add(x.pow(1).mul(6)).add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(48))return player[this.layer].buyables[this.id].pow(6);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).div(getRank().gte(55)?1:10).add(1);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					数米能力变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(48)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getRank().gte(7) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "米袋升级", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(2).mul(10)
					if(getRank().gte(21)){
						cost = x.pow(2).add(x).mul(3).add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(21))return player[this.layer].buyables[this.id].pow(3);
					return player[this.layer].buyables[this.id].mul(player[this.layer].buyables[this.id].add(1)).mul(player[this.layer].buyables[this.id].mul(2).add(1)).div(6);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = x.add(1).cbrt().div(4);
					if(eff.gte(1))eff=eff.log10().add(1);
					eff = eff.mul(buyableEffect("p",23));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					米袋倍数：" + format(data.effect.mul(4)) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(15)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getLevel().gte(15) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            22: {
                title: "自动数米加成", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(10)
					if(getRank().gte(65)){
						cost = x.pow(8).mul(9).add(x.pow(7).mul(36)).add(x.pow(6).mul(84)).add(x.pow(5).mul(126)).add(x.pow(4).mul(126)).add(x.pow(3).mul(84)).add(x.pow(2).mul(36)).add(x.pow(1).mul(9)).add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(65))return player[this.layer].buyables[this.id].pow(9);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).div(getRank().gte(110)?1:10).add(1);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					自动数米速度变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(65)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getRank().gte(17) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            23: {
                title: "米袋加成", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(15)
					if(getRank().gte(95)){
						cost = x.pow(14).mul(15)
						.add(x.pow(13).mul(105))
						.add(x.pow(12).mul(455))
						.add(x.pow(11).mul(1365))
						.add(x.pow(10).mul(3003))
						.add(x.pow(9).mul(5005))
						.add(x.pow(8).mul(6435))
						.add(x.pow(7).mul(6435))
						.add(x.pow(6).mul(5005))
						.add(x.pow(5).mul(3003))
						.add(x.pow(4).mul(1365))
						.add(x.pow(3).mul(455))
						.add(x.pow(2).mul(105))
						.add(x.pow(1).mul(15))
						.add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(95))return player[this.layer].buyables[this.id].pow(15);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).mul(3).add(1).log10().add(1).sqrt();
					if(getRank().gte(160))eff = new Decimal(x).mul(3).add(1).log10().add(1);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					米袋速度变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(95)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getRank().gte(23) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	milestones: [
		{
			requirementDescription: "完成1桶米",
            done() {return getLevel().gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每次数米时30%概率获得1金币。";
			},
        },
		{
			requirementDescription: "完成2桶米",
            done() {return getLevel().gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第一个可购买项。";
			},
        },
		{
			requirementDescription: "完成3桶米",
            done() {return getLevel().gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的米桶数增加金币获取数量。";
			},
        },
		{
			requirementDescription: "完成4桶米",
            done() {return getLevel().gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的米桶数增加金币获取概率。";
			},
        },
		{
			requirementDescription: "完成5桶米",
            done() {return getLevel().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第二个可购买项。";
			},
        },
		{
			requirementDescription: "完成10桶米",
            done() {return getLevel().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁米袋。";
			},
        },
		{
			requirementDescription: "完成15桶米",
            done() {return getLevel().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个可购买项。";
			},
        },
		{
			requirementDescription: "完成20桶米",
            done() {return getLevel().gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "可以自动购买第一个可购买项。";
			},
        },
		{
			requirementDescription: "完成25桶米",
            done() {return getLevel().gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "手动数米一定可以获得金币，且手动数米的金币获取翻倍。";
			},
        },
		{
			requirementDescription: "完成30桶米",
            done() {return getLevel().gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "获得金币时有10%概率暴击。";
			},
        },
		{
			requirementDescription: "完成40桶米",
            done() {return getLevel().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "获得金币时的暴击率随完成的米桶数而提高。";
			},
        },
		{
			requirementDescription: "完成50桶米",
            done() {return getLevel().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "手动数米获得金币时的暴击率翻倍。";
			},
        },
		{
			requirementDescription: "完成70桶米",
            done() {return getLevel().gte(70)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁成就。";
			},
        },
	]
})

addLayer("e", {
    name: "E", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "吃米", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF00FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "粒被吃掉的米", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
		if(buyableEffect("e",11)[0]===undefined)buyableEffect("e",11)[0]=new Decimal(0);
		if(buyableEffect("e",12)[0]===undefined)buyableEffect("e",12)[0]=new Decimal(0);
		if(buyableEffect("e",13)[0]===undefined)buyableEffect("e",13)[0]=new Decimal(0);
		if(buyableEffect("e",14)[0]===undefined)buyableEffect("e",14)[0]=new Decimal(0);
		if(buyableEffect("e",15)[0]===undefined)buyableEffect("e",15)[0]=new Decimal(0);
		if(buyableEffect("e",16)[0]===undefined)buyableEffect("e",16)[0]=new Decimal(0);
		if(buyableEffect("e",11)[1]===undefined)buyableEffect("e",11)[1]=new Decimal(0);
		if(buyableEffect("e",12)[1]===undefined)buyableEffect("e",12)[1]=new Decimal(0);
		if(buyableEffect("e",13)[1]===undefined)buyableEffect("e",13)[1]=new Decimal(0);
		if(buyableEffect("e",14)[1]===undefined)buyableEffect("e",14)[1]=new Decimal(0);
		if(buyableEffect("e",15)[1]===undefined)buyableEffect("e",15)[1]=new Decimal(0);
		if(buyableEffect("e",16)[1]===undefined)buyableEffect("e",16)[1]=new Decimal(0);
        mult = buyableEffect("e",11)[0].add(buyableEffect("e",12)[0]).add(buyableEffect("e",13)[0]).add(buyableEffect("e",14)[0]).add(buyableEffect("e",15)[0]).add(buyableEffect("e",16)[0]).mul(buyableEffect("e",11)[1]).mul(buyableEffect("e",12)[1]).mul(buyableEffect("e",13)[1]).mul(buyableEffect("e",14)[1]).mul(buyableEffect("e",15)[1]).mul(buyableEffect("e",16)[1]);
		mult = mult.mul(buyableEffect("t",13));
		if(hasAchievement("a",21))mult = mult.mul(buyableEffect("p",21).add(1));
		if(hasAchievement("a",25))mult = mult.mul(player.a.points.div(10).add(1));
		if(getELevel().gte(600))mult = mult.mul(getELevel().div(100));
		mult = mult.mul(getRankEffect2());
		mult = mult.mul(layers.s.effect2());
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		player.t.points=getRank();
	},
	tabFormat: [
		"main-display",["display-text",function(){return "总计吃米能力："+formatWhole(layers.e.gainMult())+"*"+format(new Decimal(1).sub(player.e.points.div(getRequirement(getLevel()).max(1))).pow(2).mul(100).mul(getELevel().gte(20000)?player.points.add(1).pow(0.2):getELevel().gte(12000)?player.points.add(1).pow(0.05):1))+"%"}],
	["display-text",function(){
		let level=getELevel();
		let req1=getRequirement(level);
		let req2=getRequirement(level.add(1)).sub(req1);
		let prog=player.e.points.sub(req1);
		if(level.gte(1e8))return "您已经吃掉"+formatWhole(level)+"桶米";
		return "当前正在吃第"+formatWhole(level.add(1))+"桶米，进度："+formatWhole(prog)+"/"+formatWhole(req2)+"("+format(prog.div(req2).mul(100),5)+"%)";
	}],["display-text",function(){return "你有"+formatWhole(player.p.points)+"金币"}]
		,"clickables","buyables","milestones"
	],
    layerShown(){return getRank().gte(5)},
	getEffectiveEPoints(a=0){
		if(getLevel().lte(1))return new Decimal(0);
		a=new Decimal(a);
		if(a.div(getRequirement(getLevel())).lte(1e-7))return a;
		return a.div(getRequirement(getLevel())).add(1).pow(-1).sub(1).mul(-1).mul(getRequirement(getLevel()));
	},
	getRawEPoints(){
		if(getLevel().lte(1))return new Decimal(0);
		if(player.e.points.div(getRequirement(getLevel())).lte(1e-7))return player.e.points;
		return player.e.points.div(getRequirement(getLevel())).min(1).sub(1).pow(-1).add(1).mul(-1).mul(getRequirement(getLevel())).min(getRequirement(getLevel()).add(1).pow(2).mul(1e200));
	},
	update(diff){
		if(getELevel().gte(5)){
			player.e.points=layers.e.getEffectiveEPoints(layers.e.getRawEPoints().add(layers.e.gainMult().mul(getELevel().gte(20000)?player.points.add(1).pow(0.2):getELevel().gte(12000)?player.points.add(1).pow(0.05):1).mul(buyableEffect("e",21)).mul(diff)));
		}
		if(getELevel().gte(300000)){
			delete player.e.a1;
			let target=player.p.points.root(3).floor();
			player.e.buyables[21]=player.e.buyables[21].max(target);
		}else if(getELevel().gte(4000)&&player.e.a1){
			let target=player.p.points.div(2).add(player.e.buyables[21].pow(4)).root(4).floor().max(player.e.buyables[21]);
			if(player.p.points.gte(target.pow(4).sub(player.e.buyables[21].pow(4)))){
				player.p.points=player.p.points.sub(target.pow(4).sub(player.e.buyables[21].pow(4)));
				player.e.buyables[21]=target;
			}
		}
		if(getELevel().gte(200000)){
			let target=player.p.points.add(1).log(1.25).max(0).ceil();
			if(player.e.buyables[11].lte(target))player.e.buyables[11]=target;
			target=player.p.points.add(1).log(1.28).max(0).ceil();
			if(player.e.buyables[12].lte(target))player.e.buyables[12]=target;
			target=player.p.points.add(1).log(1.31).max(0).ceil();
			if(player.e.buyables[13].lte(target))player.e.buyables[13]=target;
			target=player.p.points.add(1).log(1.34).max(0).ceil();
			if(player.e.buyables[14].lte(target))player.e.buyables[14]=target;
			target=player.p.points.add(1).log(1.37).max(0).ceil();
			if(player.e.buyables[15].lte(target))player.e.buyables[15]=target;
			target=player.p.points.add(1).log(1.4).max(0).ceil();
			if(player.e.buyables[16].lte(target))player.e.buyables[16]=target;
		}
	},
	milestones: [
		{
			requirementDescription: "吃掉5桶米",
            done() {return getELevel().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动吃米。";
			},
        },
		{
			requirementDescription: "吃掉10桶米",
            done() {return getELevel().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第二个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉15桶米",
            done() {return getELevel().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉17桶米",
            done() {return getELevel().gte(17)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加金币获取。";
			},
        },
		{
			requirementDescription: "吃掉25桶米",
            done() {return getELevel().gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉40桶米",
            done() {return getELevel().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉50桶米",
            done() {return getELevel().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉150桶米",
            done() {return getELevel().gte(150)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加数米能力。";
			},
        },
		{
			requirementDescription: "吃掉200桶米",
            done() {return getELevel().gte(200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉300桶米",
            done() {return getELevel().gte(300)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉450桶米",
            done() {return getELevel().gte(450)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉600桶米",
            done() {return getELevel().gte(600)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加吃米能力。";
			},
        },
		{
			requirementDescription: "吃掉750桶米",
            done() {return getELevel().gte(750)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉1000桶米",
            done() {return getELevel().gte(1000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉1200桶米",
            done() {return getELevel().gte(1200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉1500桶米",
            done() {return getELevel().gte(1500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加金币获取。";
			},
        },
		{
			requirementDescription: "吃掉1750桶米",
            done() {return getELevel().gte(1750)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉2000桶米",
            done() {return getELevel().gte(2000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉2250桶米",
            done() {return getELevel().gte(2250)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉3000桶米",
            done() {return getELevel().gte(3000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉3500桶米",
            done() {return getELevel().gte(3500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉4000桶米",
            done() {return getELevel().gte(4000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动吃米更便宜。解锁自动购买自动吃米。";
			},
        },
		{
			requirementDescription: "吃掉4500桶米",
            done() {return getELevel().gte(4500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉8000桶米",
            done() {return getELevel().gte(8000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉9000桶米",
            done() {return getELevel().gte(9000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁吃米小鸟6。";
			},
        },
		{
			requirementDescription: "吃掉10000桶米",
            done() {return getELevel().gte(10000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉12000桶米",
            done() {return getELevel().gte(12000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉14000桶米",
            done() {return getELevel().gte(14000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉20000桶米",
            done() {return getELevel().gte(20000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉200000桶米",
            done() {return getELevel().gte(200000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动购买吃米小鸟，吃米小鸟加成更好，购买吃米小鸟不消耗金币。";
			},
        },
		{
			requirementDescription: "吃掉300000桶米",
            done() {return getELevel().gte(300000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "始终自动购买自动吃米，自动吃米更便宜，购买自动吃米不消耗金币。";
			},
        },
	],
	clickables: {
            11: {
                title: "开始吃米",
                display(){
					return "开始吃米";
				},
                unlocked() { return true}, 
				canClick(){return true},
				onClick(){
					player.e.points=layers.e.getEffectiveEPoints(layers.e.getRawEPoints().add(layers.e.gainMult().mul(getELevel().gte(20000)?player.points.add(1).pow(0.2):getELevel().gte(12000)?player.points.add(1).pow(0.05):1)));
				},
                style: {'height':'100px','width':'150px'},
            },
            12: {
                title: "自动购买自动吃米",
                display(){
					return player.e.a1?("已开启"):"已关闭";
				},
                unlocked() { return getELevel().gte(4000) && getELevel().lte(300000)}, 
				canClick(){return true},
				onClick(){
					player.e.a1=!player.e.a1;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	buyables: {
            11: {
                title: "吃米小鸟1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(getELevel().gte(14000)?1.25:getELevel().gte(10000)?1.4:getELevel().gte(2250)?1.6:getELevel().gte(1200)?2:getELevel().gte(200)?3:getELevel().gte(40)?5:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x.add(1),getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.add(1).mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(100));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id].add(1))+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "自动吃米", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(4)
					if(getELevel().gte(4000))cost=x.pow(3).add(x).mul(4).add(x.pow(2).mul(6).add(1));
					if(getELevel().gte(300000))cost=x.add(1).pow(3);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					自动吃米：" + formatWhole(data.effect) + "次/秒\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(5) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "吃米小鸟2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(getELevel().gte(14000)?1.28:getELevel().gte(10000)?1.44:getELevel().gte(2250)?1.7:getELevel().gte(1200)?2.25:getELevel().gte(200)?3.5:getELevel().gte(40)?6:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(100));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(10) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            13: {
                title: "吃米小鸟3", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(getELevel().gte(14000)?1.31:getELevel().gte(10000)?1.48:getELevel().gte(2250)?1.8:getELevel().gte(1200)?2.5:getELevel().gte(200)?4:getELevel().gte(40)?7:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(100));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(15) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            14: {
                title: "吃米小鸟4", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(getELevel().gte(14000)?1.34:getELevel().gte(10000)?1.52:getELevel().gte(2250)?1.9:getELevel().gte(1200)?2.75:getELevel().gte(200)?4.5:getELevel().gte(40)?8:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(100));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(25) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            15: {
                title: "吃米小鸟5", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(getELevel().gte(14000)?1.37:getELevel().gte(10000)?1.56:getELevel().gte(2250)?2:getELevel().gte(1200)?3:getELevel().gte(200)?5:getELevel().gte(40)?9:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(100));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(50) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            16: {
                title: "吃米小鸟6", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(getELevel().gte(14000)?1.4:getELevel().gte(10000)?1.6:2.1,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(100));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(9000) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	}
})

addLayer("t", {
    name: "T", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "目标", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "个目标已完成", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		player.t.points=getRank();
	},
	tabFormat: [
		"main-display",["display-text",function(){if(getRank().gte(3))return "剩余钻石数量："+formatWhole(layers.t.getBuyPoint());return "";}],["clickable",11],"buyables","milestones"
	],
    layerShown(){return getRank().gte(1)},
	milestones: [
		{
			requirementDescription: "完成1个目标",
            done() {return getRank().gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的目标数增加金币获取数量。";
			},
        },
		{
			requirementDescription: "完成2个目标",
            done() {return getRank().gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的目标数，每秒自动释放"+format(new Decimal(1).sub(getRank().sqrt().mul(0.1).add(1).pow(-1)).mul(100))+"%米袋累计的米。";
			},
        },
		{
			requirementDescription: "完成3个目标",
            done() {return getRank().gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁钻石，和第一个钻石购买项。完成目标可以获得钻石。";
			},
        },
		{
			requirementDescription: "完成4个目标",
            done() {return getRank().gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第二个钻石购买项。根据完成的米桶数增加数米能力。";
			},
        },
		{
			requirementDescription: "完成5个目标",
            done() {return getRank().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成6个目标",
            done() {return getRank().gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个钻石购买项。手动数米获得的金币翻倍。";
			},
        },
		{
			requirementDescription: "完成7个目标",
            done() {return getRank().gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个金币购买项。";
			},
        },
		{
			requirementDescription: "完成10个目标",
            done() {return getRank().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				let r=getRankEffect2().root(getRank());
				return "根据完成的目标数，数米能力和吃米能力增加。当前：每完成一个目标，变为原来的"+format(r)+"倍。";
			},
        },
		{
			requirementDescription: "完成13个目标",
            done() {return getRank().gte(13)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个钻石购买项。";
			},
        },
		{
			requirementDescription: "完成14个目标",
            done() {return getRank().gte(14)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石购买项价格减半。";
			},
        },
		{
			requirementDescription: "完成15个目标",
            done() {return getRank().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的目标数增加金币获取数量。";
			},
        },
		{
			requirementDescription: "完成17个目标",
            done() {return getRank().gte(17)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个金币购买项。";
			},
        },
		{
			requirementDescription: "完成20个目标",
            done() {return getRank().gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成21个目标",
            done() {return getRank().gte(21)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米袋升级更便宜。";
			},
        },
		{
			requirementDescription: "完成23个目标",
            done() {return getRank().gte(23)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第六个金币购买项。";
			},
        },
		{
			requirementDescription: "完成25个目标",
            done() {return getRank().gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个钻石购买项。";
			},
        },
		{
			requirementDescription: "完成30个目标",
            done() {return getRank().gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第六个钻石购买项。";
			},
        },
		{
			requirementDescription: "完成32个目标",
            done() {return getRank().gte(32)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动数米更便宜。";
			},
        },
		{
			requirementDescription: "完成35个目标",
            done() {return getRank().gte(35)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成40个目标",
            done() {return getRank().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成45个目标",
            done() {return getRank().gte(45)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据已完成的目标数量，第一行钻石升级更好。";
			},
        },
		{
			requirementDescription: "完成48个目标",
            done() {return getRank().gte(48)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "数米加成更便宜。";
			},
        },
		{
			requirementDescription: "完成50个目标",
            done() {return getRank().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动购买数米加成。";
			},
        },
		{
			requirementDescription: "完成55个目标",
            done() {return getRank().gte(55)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "数米加成效果更好。";
			},
        },
		{
			requirementDescription: "完成58个目标",
            done() {return getRank().gte(58)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石购买项价格减半。";
			},
        },
		{
			requirementDescription: "完成60个目标",
            done() {return getRank().gte(60)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成65个目标",
            done() {return getRank().gte(65)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动数米加成更便宜。";
			},
        },
		{
			requirementDescription: "完成70个目标",
            done() {return getRank().gte(70)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动购买自动数米加成。";
			},
        },
		{
			requirementDescription: "完成75个目标",
            done() {return getRank().gte(75)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成85个目标",
            done() {return getRank().gte(85)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石购买项价格减半。";
			},
        },
		{
			requirementDescription: "完成90个目标",
            done() {return getRank().gte(90)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成95个目标",
            done() {return getRank().gte(95)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米袋加成更便宜。";
			},
        },
		{
			requirementDescription: "完成100个目标",
            done() {return getRank().gte(100)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成110个目标",
            done() {return getRank().gte(110)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动数米加成效果更好。";
			},
        },
		{
			requirementDescription: "完成125个目标",
            done() {return getRank().gte(125)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据已完成的目标数量，第一行钻石升级和钻石升级“自动数米”更好。";
			},
        },
		{
			requirementDescription: "完成150个目标",
            done() {return getRank().gte(150)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石升级不再消耗钻石。";
			},
        },
		{
			requirementDescription: "完成160个目标",
            done() {return getRank().gte(160)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米袋加成效果更好。";
			},
        },
		{
			requirementDescription: "完成175个目标",
            done() {return getRank().gte(175)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁工人升级。";
			},
        },
		{
			requirementDescription: "完成185个目标",
            done() {return getRank().gte(185)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动购买米袋加成。";
			},
        },
		{
			requirementDescription: "完成200个目标",
            done() {return getRank().gte(200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
	],
	clickables: {
			11: {
				title: "重置钻石升级",
				display: "重置钻石升级",
				unlocked(){return getRank().gte(3)},
				canClick(){return true},
				onClick(){
					player.t.buyables[11]=new Decimal(0);
					player.t.buyables[12]=new Decimal(0);
					player.t.buyables[13]=new Decimal(0);
					player.t.buyables[21]=new Decimal(0);
					player.t.buyables[22]=new Decimal(0);
					player.t.buyables[23]=new Decimal(0);
				},
                style: {'height':'100px','width':'150px'},
			},
	},
	buyables: {
            11: {
                title: "金币获取", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.add(1,x).pow(getRank().gte(125)?getRank().div(50):getRank().gte(45)?getRank().div(100).add(1):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					金币获取变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(3) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "数米能力", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.add(1,x).pow(getRank().gte(125)?getRank().div(50):getRank().gte(45)?getRank().div(100).add(1):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					数米能力变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(4) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            13: {
                title: "吃米能力", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.add(1,x).pow(getRank().gte(125)?getRank().div(50):getRank().gte(45)?getRank().div(100).add(1):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(6) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "金币返还", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(x.gte(14))return Decimal.dInf;
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.sub(1,Decimal.mul(0.1,x));
					if(x.gte(8))eff = Decimal.add(0.01,Decimal.sub(15,x).mul(Decimal.sub(14,x)).div(200));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					购买金币升级后返还" + format(Decimal.sub(100,data.effect.mul(100))) + "%金币\n\
					对吃米升级无效。\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(13) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost) && player[this.layer].buyables[this.id].lt(14)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).min(14)
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            22: {
                title: "自动数米", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.add(1,x).pow(getRank().gte(125)?getRank().div(100):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					自动数米速度变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(25) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            23: {
                title: "数米能力价格", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(x.gte(9))return Decimal.dInf;
					let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.sub(10,x)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					数米能力价格：" + formatWhole(data.effect) + "金币\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(30) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost) && player[this.layer].buyables[this.id].lt(9)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).min(9)
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	getBuyPoint(){
		let bp=player.t.points.pow(2);
		bp=bp.mul(layers.s.effect4()).floor().add(1e-10);
		if(getRank().gte(150))return bp;
		bp=bp.sub(Decimal.pow(2,player.t.buyables[11].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[12].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[13].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[21].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[22].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[23].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		return bp;
	}
})

addLayer("a", {
    name: "A", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "成就", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "成就点", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: [],
	update(diff){
		player.a.points=new Decimal(player.a.achievements.length);
		if(hasAchievement("a",52))player.a.points=player.a.points.mul(2);else if(hasAchievement("a",51))player.a.points=player.a.points.mul(1.5);
		player.a.points=player.a.points.mul(layers.s.effect5());
	},
	tabFormat: [
		"main-display","achievements"
	],
    layerShown(){return getLevel().gte(75)},
    achievementPopups: true,
	achievements:{
		11:{
			name: "一切的开始",
			done() {return getRank().gte(1)},
			tooltip: "数完一亿粒米！奖励：解锁新的层级，并且成就点加成金币获取。",
		},
		12:{
			name: "新的货币",
			done() {return getRank().gte(3)},
			tooltip: "完成3个目标。",
		},
		13:{
			name: "青铜米袋",
			done() {return player.p.buyables[21].gte(100)},
			tooltip: "达到100级米袋。",
		},
		14:{
			name: "青铜自动机",
			done() {return player.p.buyables[12].gte(100)},
			tooltip: "达到100级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		15:{
			name: "吸引力",
			done() {return getRank().gte(5)},
			tooltip: "完成5个目标。",
		},
		16:{
			name: "更快的吃米速度",
			done() {return getELevel().gte(50)},
			tooltip: "解锁5个吃米小鸟。",
		},
		17:{
			name: "吃一亿粒米",
			done() {return getELevel().gte(100)},
			tooltip: "吃掉一亿粒米。奖励：解锁自动购买自动数米。",
		},
		21:{
			name: "中倍率米袋",
			done() {return buyableEffect("p",21).gte(1.25)},
			tooltip: "米袋倍数达到5。奖励：米袋倍数提升吃米能力。",
		},
		22:{
			name: "一次一亿粒米",
			done() {return player.p.buyables[11].gte(1e8)},
			tooltip: "达到一亿级数米能力。",
		},
		23:{
			name: "白银米袋",
			done() {return player.p.buyables[21].gte(500)},
			tooltip: "达到500级米袋。",
		},
		24:{
			name: "白银自动机",
			done() {return player.p.buyables[12].gte(500)},
			tooltip: "达到500级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		25:{
			name: "万、亿、兆后面是什么？",
			done() {return getRank().gte(8)},
			tooltip: "完成8个目标。奖励：成就点加成吃米能力。",
		},
		26:{
			name: "吃的小饱",
			done() {return getELevel().gte(500)},
			tooltip: "吃掉500桶米。奖励：成就点加成数米能力。",
		},
		27:{
			name: "指数级增长",
			done() {return getRank().gte(10)},
			tooltip: "完成10个目标。奖励：解锁自动购买米袋升级。",
		},
		31:{
			name: "千层米",
			done() {return getELevel().gte(1000)},
			tooltip: "吃掉1000桶米。",
		},
		32:{
			name: "20个0",
			done() {return getRank().gte(13)},
			tooltip: "完成13个目标。",
		},
		33:{
			name: "黄金米袋",
			done() {return player.p.buyables[21].gte(2000)},
			tooltip: "达到2000级米袋。",
		},
		34:{
			name: "黄金自动机",
			done() {return player.p.buyables[12].gte(2000)},
			tooltip: "达到2000级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		35:{
			name: "兆、京、垓后面是什么？",
			done() {return getRank().gte(16)},
			tooltip: "完成16个目标。",
		},
		36:{
			name: "吃的较饱",
			done() {return getELevel().gte(2500)},
			tooltip: "吃掉2500桶米。",
		},
		37:{
			name: "青铜加成",
			done() {return player.p.buyables[13].gte(100)},
			tooltip: "达到100级数米加成。",
		},
		41:{
			name: "这已经很多了吗？",
			done() {return getLevel().gte(4000)},
			tooltip: "数完4000桶米。",
		},
		42:{
			name: "米神下凡",
			done() {return getRank().gte(20)},
			tooltip: "完成20个目标。",
		},
		43:{
			name: "白金米袋",
			done() {return player.p.buyables[21].gte(10000)},
			tooltip: "达到10000级米袋。",
		},
		44:{
			name: "白金自动机",
			done() {return player.p.buyables[12].gte(10000)},
			tooltip: "达到10000级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		45:{
			name: "垓、秭、穰后面是什么？",
			done() {return getRank().gte(24)},
			tooltip: "完成24个目标。",
		},
		46:{
			name: "吃的饱饱",
			done() {return getELevel().gte(5000)},
			tooltip: "吃掉5000桶米。",
		},
		47:{
			name: "黄金吃米自动机",
			done() {return player.e.buyables[21].gte(2000)},
			tooltip: "达到2000级自动吃米。",
		},
		51:{
			name: "米神供奉者 1",
			done() {return layers.s.effect2().gte(2)},
			tooltip: "米神的吃米能力加成达到2倍。奖励：成就点变为1.5倍。",
		},
		52:{
			name: "米神供奉者 2",
			done() {return layers.s.effect1().gte(2)},
			tooltip: "米神的数米能力加成达到2倍。奖励：上一个成就的奖励变为2倍。",
		},
		53:{
			name: "钻石米袋",
			done() {return player.p.buyables[21].gte(200000)},
			tooltip: "达到200000级米袋。",
		},
		54:{
			name: "钻石自动机",
			done() {return player.p.buyables[12].gte(200000)},
			tooltip: "达到200000级自动数米。",
		},
		55:{
			name: "穰、沟、涧后面是什么？",
			done() {return getRank().gte(32)},
			tooltip: "完成32个目标。",
		},
		56:{
			name: "白金吃米自动机",
			done() {return player.e.buyables[21].gte(10000)},
			tooltip: "达到10000级自动吃米。",
		},
		57:{
			name: "米神供奉者 3",
			done() {return layers.s.effect3().gte(2)},
			tooltip: "米神的金币加成达到2倍。",
		},
		61:{
			name: "数一万桶米",
			done() {return getLevel().gte(10000)},
			tooltip: "完成一万桶米。",
		},
		62:{
			name: "更强的吸引力",
			done() {return getELevel().gte(9000)},
			tooltip: "解锁吃米小鸟6。",
		},
		63:{
			name: "万层米",
			done() {return getELevel().gte(10000)},
			tooltip: "吃掉一万桶米。",
		},
		64:{
			name: "青铜自动机加成",
			done() {return player.p.buyables[22].gte(100)},
			tooltip: "达到100级自动数米加成。",
		},
		65:{
			name: "涧、正、载后面是什么？",
			done() {return getRank().gte(40)},
			tooltip: "完成40个目标。",
		},
		66:{
			name: "米神供奉者 4",
			done() {return layers.s.effect4().gte(2)},
			tooltip: "米神的钻石加成达到2倍。奖励：米神增加成就点获取。",
		},
		67:{
			name: "白银加成",
			done() {return player.p.buyables[13].gte(500)},
			tooltip: "达到500级数米加成。",
		},
		71:{
			name: "高倍率米袋",
			done() {return buyableEffect("p",21).gte(5)},
			tooltip: "米袋倍数达到20。奖励：米袋倍数提升自动数米能力。",
		},
		72:{
			name: "米神供奉者 5",
			done() {return layers.s.effect1().gte(10)},
			tooltip: "米神的数米能力加成达到10倍。",
		},
		73:{
			name: "黄金加成",
			done() {return player.p.buyables[13].gte(2000)},
			tooltip: "达到2000级数米加成。",
		},
		74:{
			name: "闪光米袋",
			done() {return player.p.buyables[21].gte(5000000)},
			tooltip: "达到5000000级米袋。",
		},
		75:{
			name: "比太阳系还大",
			done() {return getRank().gte(35)},
			tooltip: "数1e42粒米。",
		},
		76:{
			name: "无限进度20%",
			done() {return getRank().gte(60)},
			tooltip: "完成60个目标。",
		},
		77:{
			name: "白金加成",
			done() {return player.p.buyables[13].gte(10000)},
			tooltip: "达到10000级数米加成。",
		},
		81:{
			name: "白银自动机加成",
			done() {return player.p.buyables[22].gte(500)},
			tooltip: "达到500级自动数米加成。",
		},
		82:{
			name: "比银河系还大",
			done() {return getRank().gte(53)},
			tooltip: "数1e60粒米。",
		},
		83:{
			name: "米神供奉者 6",
			done() {return layers.s.effect3().gte(10)},
			tooltip: "米神的金币加成达到10倍。",
		},
		84:{
			name: "米袋王者",
			done() {return player.p.buyables[21].gte(1e8)},
			tooltip: "达到一亿级米袋。",
		},
		85:{
			name: "闪光自动机",
			done() {return player.p.buyables[12].gte(5000000)},
			tooltip: "达到5000000级自动数米。",
		},
		86:{
			name: "自动王者",
			done() {return player.p.buyables[12].gte(1e8)},
			tooltip: "达到一亿级自动数米。",
		},
		87:{
			name: "古戈尔",
			done() {return getRank().gte(93)},
			tooltip: "数1e100粒米。",
		},
		91:{
			name: "黄金自动机加成",
			done() {return player.p.buyables[22].gte(2000)},
			tooltip: "达到2000级自动数米加成。",
		},
		92:{
			name: "钻石加成",
			done() {return player.p.buyables[13].gte(200000)},
			tooltip: "达到200000级数米加成。",
		},
		93:{
			name: "吃米王者",
			done() {return player.e.buyables[21].gte(1e8)},
			tooltip: "达到一亿级自动吃米。",
		},
		94:{
			name: "青铜米袋加成",
			done() {return player.p.buyables[23].gte(100)},
			tooltip: "达到100级米袋加成。",
		},
		95:{
			name: "协同工作",
			done() {return player.g.points.gte(1)},
			tooltip: "拥有1名工人。",
		},
		96:{
			name: "白金自动机加成",
			done() {return player.p.buyables[22].gte(10000)},
			tooltip: "达到10000级自动数米加成。",
		},
		97:{
			name: "米神供奉者 7",
			done() {return layers.s.effect5().gte(2)},
			tooltip: "米神的成就点加成达到2倍。",
		},
		101:{
			name: "一个小组",
			done() {return player.g.points.gte(10)},
			tooltip: "拥有10名工人。",
		},
		102:{
			name: "闪光加成",
			done() {return player.p.buyables[13].gte(5000000)},
			tooltip: "达到5000000级数米加成。",
		},
		103:{
			name: "白银米袋加成",
			done() {return player.p.buyables[23].gte(500)},
			tooltip: "达到500级米袋加成。",
		},
		104:{
			name: "超级米袋",
			done() {return buyableEffect("p",21).gte(25)},
			tooltip: "米袋倍数达到100。",
		},
		105:{
			name: "加成王者",
			done() {return player.p.buyables[13].gte(1e8)},
			tooltip: "达到一亿级数米加成。",
		},
		106:{
			name: "钻石自动机加成",
			done() {return player.p.buyables[22].gte(200000)},
			tooltip: "达到200000级自动数米加成。",
		},
		107:{
			name: "转基因米",
			done() {return getRank().gte(200)},
			tooltip: "完成200个目标。",
		},
		111:{
			name: "元-成就",
			done() {return player.a.points.gte(333)},
			tooltip: "拥有333成就点。奖励：成就点对金币的加成更好。",
		},
		112:{
			name: "黄金米袋加成",
			done() {return player.p.buyables[23].gte(2000)},
			tooltip: "达到2000级米袋加成。",
		},
		113:{
			name: "好多金币",
			done() {return player.p.points.gte(1e50)},
			tooltip: "拥有1e50金币。",
		},
		114:{
			name: "米神供奉者 8",
			done() {return layers.s.effect4().gte(10)},
			tooltip: "米神的钻石加成达到10倍。",
		},
		115:{
			name: "钻石米袋加成",
			done() {return player.p.buyables[23].gte(10000)},
			tooltip: "达到10000级米袋加成。",
		},
		116:{
			name: "闪光自动机加成",
			done() {return player.p.buyables[22].gte(5000000)},
			tooltip: "达到5000000级自动数米加成。",
		},
		117:{
			name: "即将无限",
			done() {return getRank().gte(300)},
			tooltip: "完成300个目标。",
		},
	},
})


addLayer("s", {
    name: "S", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "米神", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF9933",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "粒已经供奉的米", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
	},
	effect1(){
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(90)?7:getRank().gte(75)?6:getRank().gte(60)?4.5:3);
	},
	effect2(){
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(90)?9:getRank().gte(75)?8:getRank().gte(40)?7:getRank().gte(35)?5:4);
	},
	effect3(){
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(90)?2.5:2);
	},
	effect4(){
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(35)?1:0);
	},
	effect5(){
		return player.s.points.add(1e25).log10().div(25).pow(hasAchievement("a",66)?0.4:0);
	},
	effect6(){
		return player.s.points.add(1).log10().mul(player.s.points).mul(getRank().gte(40)?0.001:0);
	},
	effect7(){
		return player.s.points.add(1e75).log10().div(75).pow(getRank().gte(90)?1:0);
	},
	clickables:{
            11: {
                title: "供奉开关",
                display(){
					return player.s.a1?("开启\n米袋自动释放的米将会供奉给米神"):"关闭\n米袋自动释放的米将不会供奉给米神";
				},
                unlocked() { return true}, 
				canClick(){return true},
				onClick(){
					player.s.a1=!player.s.a1;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	tabFormat: [
		"main-display",
		["display-text","你可以通过下面的按钮将米袋自动释放的米供奉给米神。"],
		["clickable",11],
		["display-text","米神为你提供以下加成"],
		["display-text",function(){
			return "数米能力："+format(layers.s.effect1())+"倍";
		}],
		["display-text",function(){
			return "吃米能力："+format(layers.s.effect2())+"倍";
		}],
		["display-text",function(){
			return "金币获取："+format(layers.s.effect3())+"倍";
		}],
		["display-text",function(){
			if(getRank().gte(35))return "钻石获取："+format(layers.s.effect4())+"倍";
			return "";
		}],
		["display-text",function(){
			if(hasAchievement("a",66))return "成就点获取："+format(layers.s.effect5())+"倍";
			return "";
		}],
		["display-text",function(){
			if(getRank().gte(90))return "自动数米："+format(layers.s.effect7())+"倍";
			return "";
		}],
		["display-text",function(){
			if(getRank().gte(40))return "帮助数米："+format(layers.s.effect6())+"/秒";
			return "";
		}],
	],
    layerShown(){return getRank().gte(20)},
})


addLayer("g", {
    name: "G", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "工人", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#999999",
    requires: new Decimal(1e29), // Can be a function that takes requirement increases into account
    resource: "数米工人", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
	},
	buyables:{
		11: {
			title: "工作速度", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(10,x).mul(1e40);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.add(1);
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				工人的自动数米速度加成：" + format(data.effect) + "倍\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			buyMax() {}, // You'll have to handle this yourself if you want
			style: {'height':'222px'},
		},
		12: {
			title: "工作质量", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(1000,x).mul(1e45);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.001).add(0.005);
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				工人的数米能力等级指数：+" + format(data.effect) + "\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			buyMax() {}, // You'll have to handle this yourself if you want
			style: {'height':'222px'},
		},
	},
	effect1(){
		return player.g.points.mul(buyableEffect("g",11)).add(1);
	},
	effect2(){
		return player.g.points.mul(buyableEffect("g",12)).add(1);
	},
	effectDescription(){
		let data=tmp[this.layer];
		return "自动数米速度变为原来的"+format(data.effect1)+"倍，数米能力等级变为原来的"+format(data.effect2)+"次方";
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text","本层级不会重置任何东西。"],"buyables"
	],
    layerShown(){return getRank().gte(100)},
	resetsNothing: true,
})


addLayer("n", {
    name: "N", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "基因", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		progress: [
			new Decimal(0),
		],
    }},
    color: "#FF6666",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "突变基因", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		player.n.progress[0]=player.n.progress[0].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].sqrt()).mul(Math.random()*20+10).mul(diff));
		if(player.n.progress[0].gte(100)){
			player.n.points=player.n.points.add(player.n.progress[0].div(100).floor());
			player.n.progress[0]=player.n.progress[0].sub(player.n.progress[0].div(100).floor().mul(100));
		}
	},
	buyables:{
		11: {
			title: "基因突变", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(100,x).mul(1e45);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.001).add(0.005);
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				基于数米数量增加突变进度\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			buyMax() {}, // You'll have to handle this yourself if you want
			style: {'height':'222px'},
		},
	},
	effect(){
		return player.n.points.div(10).add(1);
	},
	effectDescription(){
		let data=tmp[this.layer];
		return "数米能力变为原来的"+format(data.effect)+"倍";
	},
	tabFormat: [
		"main-display",
		["display-text",function(){return "突变进度：" + format(player[this.layer].progress[0]) + "%";}],
		"buyables",
	],
    layerShown(){return getRank().gte(200)},
	resetsNothing: true,
})
