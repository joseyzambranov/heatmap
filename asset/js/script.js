let url ="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

const tooltip = document.getElementById('tooltip');

fetch(url)
.then(res=>res.json())
.then(res=>{
    const {baseTemperature,monthlyVariance} = res

    createData(monthlyVariance.map(i=>({
        ...i,
        temp: baseTemperature - i.variance
    })))
})

const color = ["#f44343","#f46343","#f4c243","#e5f443","#f0faad",
               "#fcfef1","#adfaf6","#adddfa","#43b9f4","#4381f4",
               "#436ff4"]

const month=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
             'September', 'October', 'November', 'December']

let createData = (data)=>{
 const width = 1000
 const height = 500
 const padding = 70

 const cellHeight =(height-(2*padding))/12
 const cellWidth =width/ Math.floor(data.length/12)

 const yScale =d3.scaleLinear()
                .domain([0, 11])
                .range([padding,height-padding])
 
 const xScale = d3.scaleTime()
                .domain([
                    d3.min(data,d=>d.year),
                    d3.max(data,d=>d.year)
                    ])
                    .range([padding,width-padding])  

 const tempScale = d3.scaleLinear()
                    .domain([
                        d3.min(data,d=>d.temp),
                        d3.max(data,d=>d.temp)
                    ])
                    .range([0,10])                   
                
                
 const svg = d3.select("#container").append("svg")
                .attr("width",width)
                .attr("height",height)
                
svg.selectAll("rect")
   .data(data)
   .enter()
   .append("rect")
   .attr("class","cell")
   .attr("data-month",d=>d.month-1)
   .attr("data-year",d=>d.year)
   .attr("data-temp",d=>d.temp)
   .attr("fill",d=>color[Math.floor(tempScale(d.temp))])
   .attr("x",d=>xScale(d.year))
   .attr("y",d=>yScale(d.month-1)-cellHeight)
   .attr("width",cellWidth)
   .attr('height', cellHeight)
   .on('mouseover', (d, i) => {
    tooltip.classList.add('show');
    tooltip.style.left = xScale(d.year) - 60 + 'px';
    tooltip.style.top = yScale(d.month - 1) - 60 + 'px';
    tooltip.setAttribute('data-year', d.year);

    tooltip.innerHTML = `
      <p>${d.year} - ${month[d.month - 1]}</p>
      <p>${d.temp}℃</p>
    `;
}).on('mouseout', () => {
   tooltip.classList.remove('show');
});
              
                
/*create axis*/

const xAxis = d3.axisBottom(xScale)
              .tickFormat(d3.format("d"))
const yAxis = d3.axisLeft(yScale)
            .tickFormat((month)=>{
                const date = new Date(0)
                date.setUTCMonth(month+1)
                return d3.timeFormat("%B")(date)
            })
            svg.append('g')
                .attr('id', 'x-axis')
                .attr('transform', `translate(0, ${height - padding})`)
                .call(xAxis);

            svg.append('g')
                .attr('id', 'y-axis')
                .attr('transform', `translate(${padding}, ${-cellHeight})`)
                .call(yAxis);    

     /*legend*/
     
     let lengWidth = 500
     let lengHeight = 30

     let lengRectWidth = lengWidth/ color.length
     const legend = d3.select("body")
                    .append("svg")
                    .attr("id","legend")
                    .attr("width",lengWidth)
                    .attr("height",lengHeight)
                    .selectAll("rect")
                    .data(color)
                    .enter()
                    .append("rect")
                    .attr("x",(_,i)=>i*lengRectWidth)
                    .attr("y",0)
                    .attr("width",lengRectWidth)
                    .attr("height",lengHeight)
                    .attr("fill",c=>c)
   
}



