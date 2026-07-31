"use client";

import { Box, Card, Flex, Text } from "@radix-ui/themes";
import SelectFilter from "./selectFilter";
import { useEffect, useState } from "react";
import DatePicker from "./datePciker";

interface Filter {
  stores: string[];
  partners: string[];
  categories: string[];
  services: string[];
}

export default function ChartFilters() {
  const [filter, setFilter] = useState<Filter>({
    stores: [],
    partners: [],
    categories: [],
    services: [],
  });
  const [partner, setPartner] = useState("");
  const [store, setStore] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [groupBy, setGroupBy] = useState("");

  useEffect(() => {
    fetch("/api/v1/chart-filters")
      .then((res) => res.json())
      .then((filter) => {
        setFilter(filter);
      });
  }, []);

  const groupBys = ["Mês", "Dia"];

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
            <DatePicker />
            <Text>e</Text>
            <DatePicker />
            <Text>Agrupar por:</Text>
            <SelectFilter
              value={groupBy}
              setValue={setGroupBy}
              options={groupBys}
              placeholder="Períodos"
              unique
            ></SelectFilter>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
