"use client";

import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import SelectFilter from "./selectFilter";
import { useEffect, useState } from "react";
import DatePicker from "./datePciker";
import { ChartFilter } from "./chart";

export interface FilterOptions {
  stores: string[];
  partners: string[];
  categories: string[];
  services: string[];
}

interface ChartFiltersProps {
  handleGenerateChart: (filter: ChartFilter) => Promise<void>;
  loading: boolean;
}

export default function ChartFilters({
  handleGenerateChart,
  loading,
}: ChartFiltersProps) {
  const [filter, setFilter] = useState<FilterOptions>({
    stores: [],
    partners: [],
    categories: [],
    services: [],
  });
  const [partner, setPartner] = useState("all");
  const [store, setStore] = useState("all");
  const [category, setCategory] = useState("all");
  const [service, setService] = useState("all");
  const [groupBy, setGroupBy] = useState<string>("mês");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetch("/api/v1/chart-filters")
      .then((res) => res.json())
      .then((filter) => {
        setFilter(filter);
      });
  }, []);

  const groupBys = ["Mês", "Dia"];

  function getChartFilter() {
    console.log("filter selection");
    console.log(store);
    console.log(partner);
    console.log(service);
    console.log(category);
    console.log(startDate);
    console.log(endDate);
    console.log(!startDate);

    return {
      store: store ? store : null,
      partner: partner ? partner : null,
      service: service ? service : null,
      category: category ? category : null,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
      timeGranularity: groupBy === "mês" ? "month" : "day",
    };
  }

  return (
    <Box>
      <Card>
        <Flex gap="3" align="start" justify="between" direction="column">
          <Flex gap="3" align="center">
            <Text>Loja:</Text>
            <SelectFilter
              value={store}
              setValue={setStore}
              options={filter.stores}
              placeholder="Loja"
            ></SelectFilter>
            <Text>Profissional:</Text>
            <SelectFilter
              value={partner}
              setValue={setPartner}
              options={filter.partners}
              placeholder="Profissional"
            ></SelectFilter>
            <Text>Categoria:</Text>
            <SelectFilter
              value={category}
              setValue={setCategory}
              options={filter.categories}
              placeholder="Categoria"
            ></SelectFilter>
            <Text>Serviço:</Text>
            <SelectFilter
              value={service}
              setValue={setService}
              options={filter.services}
              placeholder="Serviço"
            ></SelectFilter>
          </Flex>
          <Flex gap="3" align="center">
            <Text>Entre:</Text>
            <DatePicker date={startDate} setDate={setStartDate} />
            <Text>e</Text>
            <DatePicker date={endDate} setDate={setEndDate} />
            <Text>Agrupar por:</Text>
            <SelectFilter
              value={groupBy}
              setValue={setGroupBy}
              options={groupBys}
              placeholder="Períodos"
              unique
            ></SelectFilter>
            <Button
              variant="classic"
              type="button"
              disabled={loading}
              onClick={() => handleGenerateChart(getChartFilter())}
            >
              Gerar Gráfico
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
