# D3-Dabbler Interactive Analysis
D3 Project creating interactive and challenging visualizations for the analysis of USA demographics such as poverty, heathcare, income and smoking. * Note: You'll need to use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.


# D3 - Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Data Sources - Published evidence to analyse

Featuring stories about the health risks facing particular demographics. Information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set estimates is from the [US Census Bureau](https://data.census.gov/cedsci/). The current data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."
![Census data](https://github.com/Yazz-01/D3-Dabbler/blob/main/assets/2-census.jpg)

### Analysing the data to find Correlations and Syntetic Data
The data was Cleaned, Transformed and Evaliuated finding out insightful correlations.
![data analysis](https://github.com/Yazz-01/D3-Dabbler/blob/main/assets/3-brfss.jpg)

### Creating Interactive Chart Process

With the data was created a scatter plot in D3 using JavaScrip and CSS between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Using the D3 techniques created a scatter plot that represents each state with circle elements. It was coded this graphic in the `app_copy.js` file to pull in the data from `data.csv` by using the `d3.csv` function. The scatter plot appears like the image following image.

![4-scatter](Images/4-scatter.jpg)
 

** Adding state abbreviations in the circles.

Three axis were created and situated labels to the left and bottom of the chart.


#*** Interactive Data

More demographics and more risk factors were included. Placed additional labels in the scatter plot and give them click events so that users can decide which data to display. Animate the transitions for your circles' locations as well as the range of the axes. This for three risk factors for each axis ... as more data more dynamics!


This was done by binding all of the CSV data to the circles. This let easily determine their x or y values when the user click the labels.


![7-animated-scatter](Images/7-animated-scatter.gif)

#### Incorporating d3-tip

Resulted an interactive scatter plot, however, as infering approximate values for each circle makes impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to your circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)—we've already included this plugin in your assignment directory.

![8-tooltip](Images/8-tooltip.gif)

* Check out [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how you should implement tooltips with d3-tip.

- - -

### Assessment

Your final product will be assessed on the following metrics:


