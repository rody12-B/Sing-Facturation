import template1 from './template1.png';
import template2 from './template2.png';
import template3 from './template3.png';
import template4 from './template4.png';
import template5 from './template5.png';
import template6 from './template6.png';
import logo from './img/logo.jpg';

export const assets = {
    template1,
    template2,
    template3,
    template4,
    template5,
    template6,
    logo
}


export default assets;

export const templates = [
    {id: "Temp1", label: "Template 1", image:assets.template1},
    {id: "Temp2", label: "Template 2", image:assets.template2},
    {id: "Temp3", label: "Template 3", image:assets.template3},
    {id: "Temp4", label: "Template 4", image:assets.template4},
    {id: "Temp5", label: "Template 5", image:assets.template5},
    {id: "Temp6", label: "Template 6", image:assets.template6},
]